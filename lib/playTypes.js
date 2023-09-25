module.exports = [{
    typeId: 3,
    regex: /([A-Z][^,\s]+(?: [A-Z][^,\s]+)+) pass incomplete(?: to ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?(?:, broken up by ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?/g,
    types: [{
        id: 1,
        position: 1,
        isOffense: true,
        yardageStat: false
    }, {
        id: 2,
        position: 2,
        isOffense: true,
        yardageStat: false
    }, {
        id: 3,
        position: 3,
        isOffense: false,
        yardageStat: false
    }]
},
{
    typeId: 4,
    regex: /([A-Z][^,\s]+(?: [A-Z][^,\s]+)+)(?: \(\w+\))?(?: [\w ]+)? pass(?: \w+)* complete to ([A-Z][^,\s]+(?: [A-Z][^,\s]+)+)(?: \(\w+\))? for a? ?(-?\d+|no gain)(?: yards?)?[^,]+(?:, tackled by ([A-Z][^,\s]+(?: [A-Z][^,\s]+)+)(?: and ([A-Z][^,\s]+(?: [A-Z][^,\s]+)+))?)?/g,
    types: [{
        id: 4,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 3
    }, {
        id: 5,
        position: 2,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 3
    }, {
        id: 6,
        position: 4,
        isOffense: false,
        yardageStat: false
    }, {
        id: 6,
        position: 5,
        isOffense: false,
        yardageStat: false
    }]
},
{
    typeId: 6,
    regex: /([A-Z][^,\s]+(?: [A-Z][^,\s]+)+)(?: \([\w&]+\))?(?: [\w ]+)? pass(?: \w+)* intercepted by ([A-Z][^,\s]+(?: [A-Z][^,\s]+)+)(?: \([\w&]+\))?(?: at the [\w\d\s-]+)?[.,] [Rr]eturned for (no gain|(?:a loss of )?-?\d+)(?: yards?)?./g,
    types: [{
        id: 20,
        position: 1,
        isOffense: true,
        yardageStat: false
    }, {
        id: 21,
        position: 2,
        isOffense: false,
        yardageStat: false
    }]
},
{
    typeId: 7,
    regex: /([A-Z][^,\s]+(?: [A-Z][^,\s]+)+) sacked (?:by (?:([A-Z][^,\s]+(?: [A-Z][^,\s]+)+)|TEAM)(?: and (?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM|- Team))? )?for(?: a loss of)? (\d+)+ yards?(?: to the \w+ \d+)?(?: ([A-Z][^,\s]+(?: [A-Z][^,\s]+)+) fumbled,(?: forced by ([A-Z][^,\s]+(?: [A-Z][^,\s]+)+),)?(?: recovered by (?:\w+ )([A-Z][^,\s]+(?: [A-Z][^,\s]+)+)?)?)?/g,
    types: [{
        id: 11,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 4
    }, {
        id: 12,
        position: 2,
        isOffense: false,
        yardageStat: false
    }, {
        id: 12,
        position: 3,
        isOffense: false,
        yardageStat: false
    }, {
        id: 8,
        position: 5,
        isOffense: true,
        yardageStat: false
    }, {
        id: 9,
        position: 6,
        isOffense: false,
        yardageStat: false
    }, {
        id: 10,
        position: 7,
        yardageStat: false
    }]
}, {
    typeId: 24,
    regex: /([A-Z][^,\s]+(?: [A-Z][^,\s]+)+) pass complete to (?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|(?:N\/A)) for (?:a 1ST down to N\/A for )?(?:((?:a loss of )?(?:\d+)|(?:no gain))(?: ya?r?ds?)?)?/g,
    types: [{
        id: 4,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 3
    }, {
        id: 5,
        position: 2,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 3
    }]
}, {
    typeId: 26,
    regex: /([A-Z][^,\s]*(?: [A-Z][^,\s]+)+) pass intercepted(?: for a (?:1ST down))?(?: for a TD)?(?:, touchback.)?(?: by)? (?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|(?:TEAM)),? return for ((?:a loss of)?(?:\d+)?(?:no gain)?)/g,
    types: [{
        id: 20,
        position: 1,
        isOffense: true,
        yardageStat: false
    }, {
        id: 21,
        position: 2,
        isOffense: false,
        yardageStat: false
    }]
}, {
    typeId: 36,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)(?: \(\w+\))? pass (?:[\w\s]+ )?intercepted(?: for a TD)?(?: by)? )?([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)(?: \(\w+\).)?,?(?: \d+ Yd Interception)? [Rr]eturn/g,
    types: [{
        id: 20,
        position: 1,
        isOffense: true,
        yardageStat: false
    }, {
        id: 21,
        position: 2,
        isOffense: false,
        yardageStat: false
    }, {
        id: 22,
        position: 2,
        isOffense: false,
        yardageStat: false
    }]
}, {
    typeId: 67,
    regex: /([A-Z][^,\s]*(?: [A-Z][^,\s]+)+) pass complete to ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)(?: for (\d+) yds?)? for a TD/g,
    types: [{
        id: 4,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 3
    }, {
        id: 5,
        position: 2,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 3
    }, {
        id: 22,
        position: 1,
        isOffense: true,
        yardageStat: false
    }, {
        id: 22,
        position: 2,
        isOffense: true,
        yardageStat: false
    }]
}, {
    typeId: 67,
    regex: /([A-Z][^,\s]*(?: [A-Z][^,\s]+)+) (\d+) Yd pass from ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)/g,
    types: [{
        id: 4,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 5,
        position: 3,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 22,
        position: 1,
        isOffense: true,
        yardageStat: false
    }, {
        id: 22,
        position: 3,
        isOffense: true,
        yardageStat: false
    }]
}, {
    typeId: 5,
    regex: /([A-Z][^,\s]*(?: [A-Z][^,\s]+)+) run for ((?:a loss of )?(?:\d+)|(?:no gain))/g,
    types: [{
        id: 7,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }]
}, {
    typeId: 9,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM) run for ((?:a loss of )?(?:\d+)|(?:no gain))(?:(?: ya?r?ds?)? to the (?:\w+ \d+)?(?:50 yard line)? )?(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM) fumbled(?:, forced by ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?(?:, recovered by \w+ ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?/g,
    types: [{
        id: 7,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 8,
        position: 3,
        isOffense: true,
        yardageStat: false
    }, {
        id: 9,
        position: 4,
        isOffense: false,
        yardageStat: false
    }, {
        id: 10,
        position: 5,
        yardageStat: false
    }]
}, {
    typeId: 9,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)) pass complete to (?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM) for ((?:a loss of )?(?:\d+)|(?:no gain))(?:(?: ya?r?ds?)? )?(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM) fumbled(?:, forced by ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?(?:, recovered by \w+ ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?/g,
    types: [{
        id: 4,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 3
    }, {
        id: 5,
        position: 2,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 3
    }, {
        id: 8,
        position: 4,
        isOffense: true,
        yardageStat: false
    }, {
        id: 9,
        position: 5,
        isOffense: false,
        yardageStat: false
    }, {
        id: 10,
        position: 6,
        yardageStat: false
    }]
}, {
    typeId: 9,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)) sacked(?: by (?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM))?(?: and (?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM))? for ((?:a loss of )?(?:\d+)|(?:no gain))(?:(?: ya?r?ds?)? )?(?:to the (?:\w+ \d+)?(?:50 yard line)? )(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM) fumbled(?:, forced by ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?(?:, recovered by \w+ ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?/g,
    types: [{
        id: 11,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 4
    }, {
        id: 12,
        position: 2,
        isOffense: false,
        yardageStat: false
    }, {
        id: 12,
        position: 3,
        isOffense: false,
        yardageStat: false
    }, {
        id: 8,
        position: 5,
        isOffense: true,
        yardageStat: false
    }, {
        id: 9,
        position: 6,
        isOffense: false,
        yardageStat: false
    }, {
        id: 10,
        position: 7,
        yardageStat: false
    }]
}, {
    typeId: 29,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM) run for ((?:a loss of )?(?:\d+)|(?:no gain))(?:(?: ya?r?ds?)? to the (?:\w+ \d+)?(?:50 yard line)? )?(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM) fumbled(?:, forced by ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?(?:, recovered by \w+ ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?/g,
    types: [{
        id: 7,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 8,
        position: 3,
        isOffense: true,
        yardageStat: false
    }, {
        id: 9,
        position: 4,
        isOffense: false,
        yardageStat: false
    }, {
        id: 10,
        position: 5,
        yardageStat: false
    }]
}, {
    typeId: 29,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)) pass complete to (?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM) for ((?:a loss of )?(?:\d+)|(?:no gain))(?:(?: ya?r?ds?)? )?(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM) fumbled(?:, forced by ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?(?:, recovered by \w+ ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?/g,
    types: [{
        id: 4,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 3
    }, {
        id: 5,
        position: 2,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 3
    }, {
        id: 8,
        position: 4,
        isOffense: true,
        yardageStat: false
    }, {
        id: 9,
        position: 5,
        isOffense: false,
        yardageStat: false
    }, {
        id: 10,
        position: 6,
        yardageStat: false
    }]
}, {
    typeId: 29,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)) sacked(?: by (?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM))?(?: and (?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM))? for ((?:a loss of )?(?:\d+)|(?:no gain))(?:(?: ya?r?ds?)? )?(?:to the (?:\w+ \d+)?(?:50 yard line)? )(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)|TEAM) fumbled(?:, forced by ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?(?:, recovered by \w+ ([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?/g,
    types: [{
        id: 11,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 4
    }, {
        id: 12,
        position: 2,
        isOffense: false,
        yardageStat: false
    }, {
        id: 12,
        position: 3,
        isOffense: false,
        yardageStat: false
    }, {
        id: 8,
        position: 5,
        isOffense: true,
        yardageStat: false
    }, {
        id: 9,
        position: 6,
        isOffense: false,
        yardageStat: false
    }, {
        id: 10,
        position: 7,
        yardageStat: false
    }]
}, {
    typeId: 39,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)) \d+ Yd Fumble Return/g,
    types: [{
        id: 9,
        position: 1,
        isOffense: false,
        yardageStat: false
    }, {
        id: 22,
        position: 1,
        isOffense: false,
        yardageStat: false
    }]
}, {
    typeId: 68,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))(?: run for)? (\d+) [Yy]ds?(?: Run)?(?: for a TD)?/g,
    types: [{
        id: 7,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 22,
        position: 1,
        isOffense: true,
        yardageStat: false
    }]
}, {
    typeId: 59,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)) (\d+) [yY](?:ar)?d/g,
    types: [{
        id: 23,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 24,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }]
}, {
    typeId: 60,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)) (\d+) [yY](?:ar)?d/g,
    types: [{
        id: 23,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 25,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }]
}, {
    typeId: 18,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)) (\d+) [yY](?:ar)?d FG BLOCKED blocked by ?(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+))?/g,
    types: [{
        id: 23,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 25,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 18,
        position: 1,
        isOffense: true
    }, {
        id: 19,
        position: 2,
        isOffense: false
    }]
}, {
    typeId: 40,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)) (\d+) [yY](?:ar)?d FG,? (?:MISSED|RETURNED) ?(?: for a 1ST down )?/g,
    types: [{
        id: 23,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 25,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }]
}, {
    typeId: 41,
    regex: /(?:([A-Z][^,\s]*(?: [A-Z][^,\s]+)+)) (\d+) [yY](?:ar)?d FG,? (?:MISSED|RETURNED) ?(?: for a 1ST down )?/g,
    types: [{
        id: 23,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }, {
        id: 25,
        position: 1,
        isOffense: true,
        yardageStat: true,
        yardagePosition: 2
    }]
}
]