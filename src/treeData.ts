export function dynamicName() { return Math.random().toString(32).slice(2); }

export const treeData = {
    name: 'con',
    id: dynamicName(),
    isExpand: true,
    children: [
        {
            id: dynamicName(),
            name: 'EG1',
            isExpand: true,
            ExAtt:{
                startDate:'2003-01-01',
                //endDate:'2003-01-01',
            },
            children: [
                {
                    id: dynamicName(),
                    name: 'C1',
                    isExpand: true,
                    ExAtt:{
                        startDate:'2003-01-05',
                        endDate:'2003-03-31'
                    },
                    children: [
                        {
                            id: dynamicName(),
                            name: 'PG1',
                            isExpand: true,
                            ExAtt:{
                                startDate:'2003-04-05',
                                endDate:'2003-05-01'
                            },
                            children:getProducts()
                        }]
                },
                {
                    id: dynamicName(),
                    name: 'C2',
                    isExpand: true,

                    ExAtt:{
                        startDate:'2003-01-05',
                        endDate:'2003-03-31'
                    },
                    children: [
                        {
                            id: dynamicName(),
                            name: 'PG1',
                            isExpand: true,
                            ExAtt:{
                                startDate:'2003-04-05',
                                endDate:'2003-05-01'
                            },
                            children:getProducts()
                        }]
                },
                {
                    id: dynamicName(),
                    name: 'C3',
                    isExpand: true,
                    ExAtt:{
                        startDate:'2003-01-05',
                        endDate:'2003-03-31'
                    },
                    children: [
                        {
                            id: dynamicName(),
                            name: 'PG1',
                            isExpand: true,
                            ExAtt:{
                                startDate:'2003-04-05',
                                endDate:'2003-05-01'
                            },
                            children:getProducts()
                        }]
                }
            ]
        },
        {
            id: dynamicName(),
            name: 'EG2',
            isExpand: true,
            ExAtt:{
                startDate:'2003-01-01',
                endDate:'2003-01-30'
            },
            children: [
                {
                    id: dynamicName(),
                    name: 'C2',
                    ExAtt:{
                        startDate:'2003-04-01',
                        endDate:'2003-04-12'
                    },
                    isExpand: true,
                },
                {
                    id: dynamicName(),
                    name: 'C5',
                    isExpand: true,
                    ExAtt:{
                        startDate:'2003-03-01',
                        endDate:'2003-04-12'
                    }
                }
            ]
        },
    ],
};

function getProducts(){
    return [
        {
            id: dynamicName(),
            name: 'P1',
            isExpand: true,
            ExAtt:{
                startDate:'2003-06-05',
                endDate:'2003-06-10'
            },
            children:[
                {
                    id: dynamicName(),
                    name: 'Deduction1',
                    isExpand: true,
                    ExAtt:{
                        startDate:'2003-07-05'
                    }
                }
            ]
        },
        {
            id: dynamicName(),
            name: 'P2',
            isExpand: true,
            ExAtt:{
                startDate:'2003-06-05',
                endDate:'2003-06-10'
            },
            children:[
                {
                    id: dynamicName(),
                    name: 'Deduction1',
                    isExpand: true,
                    ExAtt:{
                        startDate:'2003-07-05'
                    }
                }
            ]
        },
        {
            id: dynamicName(),
            name: 'P3',
            isExpand: true,
            ExAtt:{
                startDate:'2003-06-05',
                endDate:'2003-06-10'
            },
            children:[
                {
                    id: dynamicName(),
                    name: 'Deduction1',
                    isExpand: true,
                    ExAtt:{
                        startDate:'2003-07-05'
                    }
                }
            ]
        }
    ]
}