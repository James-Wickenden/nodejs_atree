'use strict';
var g;

// Parse the tree in a depth-first manner, building a list of the textual representation.
function ParseTextually(graph) {
    g = graph;
    var root = graph.getModel().getCell('root');
    var graph_list = DepthFirst_ParseToTextual(root, '1.');

    //console.log(graph_list);
    return graph_list;
};

// Depth first algorithm that parses the tree and recursively builds a list of strings
// Each string contains the relevant textual data for a cell.
// Each alternating element in the generated list is the id of the preceding cell.
function DepthFirst_ParseToTextual(cell, cell_path_str) {
    var res = [];

    var cell_str = cell_path_str + '&nbsp;';
    var spacecount = "";
    for (var sp=0;sp<=cell_path_str.length;sp++) {
        spacecount += '&nbsp;';
    }

    // Build the string textually representing each cell:
    // The numerical representation of the cell's location in the tree, the cell label, the AND/OR label (if a parent to 2+ cells), and the attributes.
    cell_str += cell.getAttribute('label');
    if (GetChildren(cell).length >=2) cell_str += ' (' + cell.getAttribute('nodetype') + ')';
    cell_str += '<br>';

    for (var key in attributes) {
        cell_str += spacecount + key + ': ' + cell.getAttribute(key) + '<br>';
    }
    res.push(cell_str);
    res.push(cell.getId());

    // Then, concatenate this list with the result of recursively getting a list of the child cells, and return it for depth-first recursing.
    var children = GetChildren(cell);
    for (var i = 0; i < children.length; i++) {
        res = res.concat(DepthFirst_ParseToTextual(children[i], cell_path_str + (i + 1).toString() + '.'));
    }
    return res;
};

// For each cell in the graph, create a list element in the textual graph representation
// Formatting is done with clunky innerHTML spacing but it works as a demo.
function Load_textual_graph(cells_list) {
    var tcl = document.getElementById('textual_cells_list');
    tcl.innerHTML = '';

    for (var i = 0; i < cells_list.length/2; i++) {
        var li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.onclick = CreateTextCellButtons;
        li.innerHTML = cells_list[i*2];
        li.setAttribute('name', cells_list[(i*2)+1]);
        tcl.appendChild(li);
    }
};

// When a textual list node is clicked, bring up a set of buttons for performing operations on that cell.
function CreateTextCellButtons() {
    // Look at the items children;
    // if the operations div already exists, delete it and return to 'deselect' the cell
    for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].getAttribute('name') == 'flex_operations') {
            this.children[i].remove();
            return;
        }
    }

    // Now, we can (re)create the operations div
    // First, create the flexbox div that contains the buttons
    var flexbox_celloptions = document.createElement('div');
    flexbox_celloptions.setAttribute('name', 'flex_operations');
    flexbox_celloptions.style.display = 'flex';
    flexbox_celloptions.style.padding = '6px';
    this.appendChild(flexbox_celloptions);

    // Next, create the buttons for the three main operations to do on cells
    const editButton = AddButton_List('Edit cell', EditCell_Textual, flexbox_celloptions);
    const addChildButton = AddButton_List('Add child', AddChild_Textual, flexbox_celloptions);
    const deleteButton = AddButton_List('Delete subtree', DeleteSubtree_Textual, flexbox_celloptions);
};

function EditCell_Textual(evt) {
    evt.stopPropagation();
    var li = evt.target.parentElement.parentElement;
    var cell_id = li.getAttribute('name');
};

function AddChild_Textual(evt) {
    evt.stopPropagation();
    var li = evt.target.parentElement.parentElement;
    var cell_id = li.getAttribute('name');
    
};

function DeleteSubtree_Textual(evt) {
    evt.stopPropagation();
    var li = evt.target.parentElement.parentElement;
    var cell_id = li.getAttribute('name');
    DeleteSubtree(g, g.getModel().getCell(cell_id));
};

// Create a button for modifying a selected cell on the graph list.
function AddButton_List(text, handler, parent) {
    const res = document.createElement('button');
    res.innerText = text;
    res.style.flex = 1;
    res.style.marginLeft = '6px';
    res.style.marginRight = '6px';
    res.style.cursor = 'pointer';
    res.style.backgroundColor = 'darkblue';
    res.style.color = 'white';
    res.addEventListener('click', handler);
    parent.appendChild(res);

    return res;
};