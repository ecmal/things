export default [{
    id                    : 'sergey',
    name                  : 'Sergey Mamyan',
    posts                 : [{
        id                : "P1",
        title             : "Sergey's First Post",
        content           : "Sergey's First Post Content",
        owner             : {
            id            : 'sergey',
            name          : 'Sergey Mamyan'
        },
        comments          : [{
            id            : 'C1',
            message       : 'First Comment',
            post          : {
                id        : "P1",
                title     : "Sergey's First Post",
            },
            owner         : {
                id        : 'lyov',
                name      : 'Levon Gevorgyan'
            }
        },{
            id            : 'C2',
            message       : 'Second Comment',
            post          : {
                id        : "P1",
                title     : "Sergey's First Post",
            },
            owner         : {
                id        : 'sergey',
                name      : 'Sergey Mamyan'
            }
        }]
    },{
        id                : "P2",
        title             : "Sergey's Second Post",
        content           : "Sergey's Second Post Content",
        owner             : {
            id            : 'sergey',
            name          : 'Sergey Mamyan'
        },
        comments          : [{
            id            : 'C3',
            message       : 'First Comment',
            post          : {
                id        : "P2",
                title     : "Sergey's Second Post",
            },
            owner         : {
                id        : 'lyov',
                name      : 'Levon Gevorgyan'
            }
        },{
            id            : 'C4',
            message       : 'Second Comment',
            post          : {
                id        : "P2",
                title     : "Sergey's Second Post",
            },
            owner         : {
                id        : 'sergey',
                name      : 'Sergey Mamyan'
            }
        }]
    }]
},{
    id                    : 'lyov',
    name                  : 'Levon Gevorgyan',
    posts                 : [{
        id                : "P3",
        title             : "Levon's First Post",
        content           : "Levon's First Post Content",
        owner             : {
            id            : 'lyov',
            name          : 'Levon Gevorgyan'
        },
        comments          : [{
            id            : 'C5',
            message       : 'First Comment',
            post          : {
                id        : "P3",
                title     : "Levon's First Post",
            },
            owner         : {
                id        : 'lyov',
                name      : 'Levon Gevorgyan'
            }
        },{
            id            : 'C6',
            message       : 'Second Comment',
            post          : {
                id        : "P3",
                title     : "Levon's First Post",
            },
            owner         : {
                id        : 'sergey',
                name      : 'Sergey Mamyan'
            }
        }]
    },{
        id                : "P4",
        title             : "Levon's Second Post",
        content           : "Levon's Second Post Content",
        owner             : {
            id            : 'lyov',
            name          : 'Levon Gevorgyan'
        },
        comments          : [{
            id            : 'C7',
            message       : 'First Comment',
            post          : {
                id        : "P4",
                title     : "Levon's Second Post",
            },
            owner         : {
                id        : 'lyov',
                name      : 'Levon Gevorgyan'
            }
        },{
            id            : 'C8',
            message       : 'Second Comment',
            post          : {
                id        : "P4",
                title     : "Levon's Second Post",
            },
            owner         : {
                id        : 'sergey',
                name      : 'Sergey Mamyan'
            }
        }]
    }]
}]