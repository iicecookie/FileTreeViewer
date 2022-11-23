import * as React from 'react'; 
import { TreeList, orderBy, filterBy, mapTree, extendDataItem, TreeListTextFilter, TreeListNumericFilter, TreeListDateFilter, TreeListBooleanFilter } from '@progress/kendo-react-treelist';
import '@progress/kendo-theme-default/dist/all.css';

const subItemsField = 'employees';
const expandField = 'expanded';
const columns = [
    {
        field: 'id',
        title: 'Id',
        width: '30px',
        filter: TreeListNumericFilter,
        expandable: true
    },  
    {
        field: 'name',
        title: 'Name',
        width: '200px',
        filter: TreeListTextFilter, 
    },
    {
        field: 'reportsTo',
        title: 'Reports To',
        width: '50px', 
    },
    {
        field: 'phone',
        title: 'Phone',
        width: '70px',
        filter: TreeListTextFilter
    },
    {
        field: 'extension',
        title: 'Extension',
        width: '50px',
        filter: TreeListNumericFilter
    },
    {
        field: 'hireDate',
        title: 'Hire Date',
        width: '100px',
        filter: TreeListDateFilter
    },
    {
        field: 'fullTime',
        title: 'Full Time',
        width: '100px',
        filter: TreeListBooleanFilter
    },
    {
        field: 'position',
        title: 'Position',
        width: '50px',
        filter: TreeListTextFilter
    },
    {
        field: 'timeInPosition',
        title: 'Time In Position',
        width: '50px',
        filter: TreeListNumericFilter
    } 
];

function TreeDataView(props) {
    var employeesData = props.employees === undefined ? [] : props.employees; 

    const [state, setState] = React.useState({
        data: [...employeesData],
        dataState: {
            sort: [{
                field: 'name',
                dir: 'asc'
            }],
            filter: []
        },
        expanded: []
    });

    const onExpandChange = e => {
        setState({
            ...state,
            expanded: e.value ? state.expanded.filter(id => id !== e.dataItem.id) : [...state.expanded, e.dataItem.id]
        });
    };

    const handleDataStateChange = event => {
        setState({
            ...state,
            dataState: event.dataState
        });
    };
    const addExpandField = dataTree => {
        const expanded = state.expanded;
        return mapTree(dataTree, subItemsField, item => extendDataItem(item, subItemsField, {
            [expandField]: expanded.includes(item.id)
        }));
    };
    const processData = () => {
        let {
            data,
            dataState
        } = state;
        let filteredData = filterBy(data, dataState.filter, subItemsField);
        let sortedData = orderBy(filteredData, dataState.sort, subItemsField);
        return addExpandField(sortedData);
    };

    return <TreeList
        style={{
            maxHeight: '510px', 
            overflow: 'auto'
        }}
        expandField={expandField}
        subItemsField={subItemsField}
        onExpandChange={onExpandChange}
        sortable={{
            mode: 'multiple'
        }}
        {...state.dataState}
        data={processData()}
        onDataStateChange={handleDataStateChange}
        columns={columns}
    />;
};

export default TreeDataView;