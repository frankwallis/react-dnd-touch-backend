/**
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import SortableList from './SortableList.jsx';
import Immutable from 'immutable';
import { default as Touch } from '../../src/Touch';
import DragDropContext from 'react-dnd/lib/DragDropContext';
import { default as ItemPreview } from './ItemPreview.jsx';

let initialData1 = [];
let initialData2 = [];
let i = 0;
for (; i < 10; i++) {
    initialData1.push({
        id: i,
        name: `Item-${i}`
    });
    initialData2.push({
        id: i + 10,
        name: `Item-${i + 10}`
    });
}

let datasource = window.datasource = Immutable.fromJS([initialData1, initialData2])

function reorder (fromObj, toObj) {
    const dragListId = fromObj.listId;
    const dragId = fromObj.id;
    const dropListId = toObj.listId;
    const dropId = toObj.id;

    console.log(`Dragged ${dragId} in list ${dragListId} to ${dropId} in list ${dropListId}`);

    datasource = datasource.withMutations(source => {
        let dragList = source.get(dragListId);
        const dragIndex = dragList.findIndex(item => item.get('id') === dragId);
        const dragItem = dragList.get(dragIndex);
        source.set(dragListId, dragList.delete(dragIndex));

        let dropList = source.get(dropListId);
        const dropIndex = dropList.findIndex(item => item.get('id') === dropId);
        source.set(dropListId, dropList.splice(dropIndex, 0, dragItem));
    });

    render(datasource);
}

class App extends React.Component {
    render () {
        const lists = this.props.lists.toArray().map((list, i) => {
            return <SortableList key={i} id={i} data={list} onReorder={reorder}/>;
        });
        return (
            <div>
                <div id="filler">
                    This is just here to use up some space
                </div>
                <div id="main">
                    {lists}
                    <ItemPreview key="__preview" name="Item" />
                </div>
            </div>
        )
    }
}

var DragDropApp = DragDropContext(Touch({ enableMouseEvents: true }))(App);

function render (lists = datasource) {
    ReactDOM.render(<DragDropApp lists={lists} />, document.getElementById('outer'));
}

render();
