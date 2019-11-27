module.exports = (db, playTypes) => {
    const getYardage = (yardString) => {
        let yards = 0;

        if (yardString == 'no gain' || yardString == undefined) {
            yards = 0;
        } else if (yardString.indexOf("a loss of") != -1) {
            yards = yardString.replace("a loss of ", "-").trim();
        } else {
            yards = yardString;
        }

        return parseInt(yards);
    };

    const importGame = async (game) => {
        let playerStats = [];
        let players = await db.any(`
            SELECT DISTINCT t.id as team_id, t.school as team, a.id as athlete_id, a.name as athlete, a.first_name || ' ' || a.last_name AS athlete_alt
            FROM game AS g
                INNER JOIN game_team AS gt ON g.id = gt.game_id
                INNER JOIN team AS t ON gt.team_id = t.id
                INNER JOIN game_player_stat AS gps ON gt.id = gps.game_team_id
                INNER JOIN athlete AS a ON gps.athlete_id = a.id
            WHERE g.id = $1 AND a.name IS NOT NULL AND TRIM(a.name) <> ''
        `, [game.id]);

        let plays = await db.any(`
            SELECT p.*
            FROM game AS g
                INNER JOIN drive AS d ON g.id = d.game_id
                INNER JOIN play AS p ON d.id = p.drive_id
            WHERE g.id = $1
        `, [game.id]);

        for (let playType of playTypes) {
            let playRegex = playType.regex;
            for (let play of plays.filter(p => p.play_type_id == playType.typeId)) {
                playRegex.lastIndex = 0;
                let matches = playRegex.exec(play.play_text.replace('deWeaver', 'DeWeaver'));
                if (matches && matches.filter(m => m !== undefined).length > 0) {
                    for (let i = 0; i < playType.types.length; i++) {
                        let statType = playType.types[i];
                        let match = matches[statType.position]
                        if (match) {
                            let athlete = players.find(p => (p.athlete == match || p.athlete_alt == match) && (!statType.isOffense || play.offense_id == p.team_id) && (statType.isOffense || play.defense_id == p.team_id));

                            if (!athlete && (match.indexOf('Jr.') !== -1 || match.indexOf('IV' !== -1) || match.indexOf('III' != -1))) {
                                athlete = players.find(p => p.athlete == match.replace(' Jr.', '').replace(' IV', '').replace(' III', '') && (!statType.isOffense || play.offense_id == p.team_id) && (statType.isOffense || play.defense_id == p.team_id));
                            }

                            if (athlete) {
                                playerStats.push({
                                    playId: play.id,
                                    athleteId: athlete.athlete_id,
                                    statTypeId: statType.id,
                                    stat: statType.yardageStat ? getYardage(matches[statType.yardagePosition]) : 1
                                });
                            }
                        }
                    }
                }
            }
        }
        await db.tx(async t => {
            await t.batch(playerStats.map(p => t.none('INSERT INTO play_stat (play_id, athlete_id, stat_type_id, stat) VALUES ($1, $2, $3, $4)', [p.playId, p.athleteId, p.statTypeId, p.stat])))
            return Promise.resolve();
        }).catch(err => {
            console.error(err);
        });
    };

    return {
        importGame
    };
}