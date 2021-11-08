const synaptic = require('synaptic');
const Architect = synaptic.Architect;

const axios = require('axios');
const pgp = require('pg-promise');

const flaskBaseUrl = process.env.FLASK_BASE_URL;

module.exports = (db) => {
    const probabilityNetwork = Architect.Perceptron.fromJSON(require(process.env.PROBABILITY_NETWORK));
    const probabilityKeys = require(process.env.PROBABLITY_KEYS);

    const renormalizeData = (data) => {
        let inputMins = probabilityKeys.input.mins;
        let inputMaxes = probabilityKeys.input.maxes;
        let inputNorm = [];
        for (let i = 0; i < data.inputs.length; i++) {
            inputNorm.push((data.inputs[i] - inputMins[i]) / (inputMaxes[i] - inputMins[i]));
        }

        // datum.normalizedInput = inputNorm;

        return inputNorm;
    };

    const updateGameProbability = async (game) => {
        const r = await db.oneOrNone(`
            WITH plays AS (
                SELECT  g.id,
                        g.season,
                        g.week,
                        gt.team_id AS home_id,
                        gt2.team_id AS away_id,
                        gt.id AS game_team1_id,
                        gt2.id AS game_team2_id,
                        gt.winner AS home_winner,
                        CASE WHEN gt.team_id = p.offense_id THEN true ELSE false END AS home,
                        CASE
                            WHEN p.down = 2 AND p.distance >= 8 THEN 'passing'
                            WHEN p.down IN (3,4) AND p.distance >= 5 THEN 'passing'
                            ELSE 'standard'
                        END AS down_type,
                        CASE
                            WHEN p.play_type_id IN (20,26,34,36,37,38,39,63) THEN false
                            WHEN p.scoring = true THEN true
                            WHEN p.down = 1 AND (CAST(p.yards_gained AS NUMERIC) / p.distance) >= 0.5 THEN true
                            WHEN p.down = 2 AND (CAST(p.yards_gained AS NUMERIC) / p.distance) >= 0.7 THEN true
                            WHEN p.down IN (3,4) AND (p.yards_gained >= p.distance) THEN true
                            ELSE false
                        END AS success,
                        CASE 
                            WHEN p.play_type_id IN (3,4,6,7,24,26,36,51,67) THEN 'Pass'
                            WHEN p.play_type_id IN (5,9,29,39,68) THEN 'Rush'
                            ELSE 'Other'
                        END AS play_type,
                        CASE
                            WHEN p.period = 2 AND p.scoring = false AND ABS(p.home_score - p.away_score) > 38 THEN true
                            WHEN p.period = 3 AND p.scoring = false AND ABS(p.home_score - p.away_score) > 28 THEN true
                            WHEN p.period = 4 AND p.scoring = false AND ABS(p.home_score - p.away_score) > 22 THEN true
                            WHEN p.period = 2 AND p.scoring = true AND ABS(p.home_score - p.away_score) > 45 THEN true
                            WHEN p.period = 3 AND p.scoring = true AND ABS(p.home_score - p.away_score) > 35 THEN true
                            WHEN p.period = 4 AND p.scoring = true AND ABS(p.home_score - p.away_score) > 29 THEN true
                            ELSE false
                        END AS garbage_time,
                        p.period,
                        p.ppa AS ppa
                FROM game AS g
                    INNER JOIN game_team AS gt ON g.id = gt.game_id AND gt.home_away = 'home'
                    INNER JOIN game_team AS gt2 ON g.id = gt2.game_id AND gt.id <> gt2.id
                    INNER JOIN drive AS d ON g.id = d.game_id
                    INNER JOIN play AS p ON d.id = p.drive_id AND p.ppa IS NOT NULL
                WHERE g.id = $1
            )
            SELECT 	id,
                    season,
                    week,
                    home_winner,
                    game_team1_id,
                    game_team2_id,
                    AVG(ppa) FILTER(WHERE home = true) AS ppa,
                    SUM(ppa) FILTER(WHERE home = true) AS total_ppa,
                    AVG(ppa) FILTER(WHERE home = true AND play_type = 'Pass') AS passing_ppa,
                    AVG(ppa) FILTER(WHERE home = true AND play_type = 'Rush') AS rushing_ppa,
                    AVG(ppa) FILTER(WHERE home = true AND down_type = 'standard') AS standard_down_ppa,
                    AVG(ppa) FILTER(WHERE home = true AND down_type = 'passing') AS passing_down_ppa,
                    CAST(COUNT(*) FILTER(WHERE home = true AND success = true) AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = true), 0), 1) AS success_rate,
                    CAST(COUNT(*) FILTER(WHERE home = true AND success = true AND down_type = 'standard') AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = true AND down_type = 'standard'), 0), 1) AS standard_success_rate,
                    CAST(COUNT(*) FILTER(WHERE home = true AND success = true AND down_type = 'passing') AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = true AND down_type = 'passing'), 0), 1) AS passing_success_rate,
                    CAST(COUNT(*) FILTER(WHERE home = true AND success = true AND play_type = 'Rush') AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = true AND play_type = 'Rush'), 0), 1) AS rushing_success,
                    CAST(COUNT(*) FILTER(WHERE home = true AND success = true AND play_type = 'Pass') AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = true AND play_type = 'Pass'), 0), 1) AS passing_success,
                    COALESCE(AVG(ppa) FILTER(WHERE home = true AND success = true), 0) AS explosiveness,
                    COALESCE(AVG(ppa) FILTER(WHERE home = true AND success = true AND play_type = 'Pass'), 0) AS pass_explosiveness,
                    COALESCE(AVG(ppa) FILTER(WHERE home = true AND success = true AND play_type = 'Rush'), 0) AS rush_explosiveness,
                    CAST(COUNT(*) FILTER(WHERE home = true AND play_type = 'Pass') AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = true), 0), 1) AS pass_rate,
                    AVG(ppa) FILTER(WHERE home = false) AS ppa2,
                    SUM(ppa) FILTER(WHERE home = false) AS total_ppa2,
                    COALESCE(AVG(ppa) FILTER(WHERE home = false AND play_type = 'Pass'), 0) AS passing_ppa2,
                    AVG(ppa) FILTER(WHERE home = false AND play_type = 'Rush') AS rushing_ppa2,
                    AVG(ppa) FILTER(WHERE home = false AND down_type = 'standard') AS standard_down_ppa2,
                    AVG(ppa) FILTER(WHERE home = false AND down_type = 'passing') AS passing_down_ppa2,
                    CAST(COUNT(*) FILTER(WHERE home = false AND success = true) AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = false), 0), 1) AS success_rate2,
                    CAST(COUNT(*) FILTER(WHERE home = false AND success = true AND down_type = 'standard') AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = false AND down_type = 'standard'), 0), 1) AS standard_success_rate2,
                    CAST(COUNT(*) FILTER(WHERE home = false AND success = true AND down_type = 'passing') AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = false AND down_type = 'passing'), 0), 1) AS passing_success_rate2,
                    CAST(COUNT(*) FILTER(WHERE home = false AND success = true AND play_type = 'Rush') AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = false AND play_type = 'Rush'), 0), 1) AS rushing_success2,
                    CAST(COUNT(*) FILTER(WHERE home = false AND success = true AND play_type = 'Pass') AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = false AND play_type = 'Pass'), 0), 1) AS passing_success2,
                    COALESCE(AVG(ppa) FILTER(WHERE home = false AND success = true), 0) AS explosiveness2,
                    COALESCE(AVG(ppa) FILTER(WHERE home = false AND success = true AND play_type = 'Pass'), 0) AS pass_explosiveness2,
                    COALESCE(AVG(ppa) FILTER(WHERE home = false AND success = true AND play_type = 'Rush'), 0) AS rush_explosiveness2,
                    CAST(COUNT(*) FILTER(WHERE home = false AND play_type = 'Pass') AS NUMERIC) / COALESCE(NULLIF(COUNT(*) FILTER(WHERE home = false), 0), 1) AS pass_rate2
            FROM plays
            WHERE garbage_time = false
            GROUP BY id, season, week, home_winner, game_team1_id, game_team2_id
            HAVING COUNT(*) FILTER(WHERE home = false) > 0 AND COUNT(*) FILTER(WHERE home = true) > 0
        `, [game.id]);

        if (!r) {
            return null;
        }

        const trainingData = {
            id: r.id,
            year: parseInt(r.season),
            week: parseInt(r.week),
            inputs: [
                parseFloat(r.ppa),
                parseFloat(r.total_ppa),
                parseFloat(r.passing_ppa),
                parseFloat(r.rushing_ppa),
                parseFloat(r.standard_down_ppa),
                parseFloat(r.passing_down_ppa),
                parseFloat(r.success_rate),
                parseFloat(r.standard_success_rate),
                parseFloat(r.passing_success_rate),
                parseFloat(r.passing_success),
                parseFloat(r.rushing_success),
                parseFloat(r.explosiveness),
                parseFloat(r.pass_explosiveness),
                parseFloat(r.rush_explosiveness),
                parseFloat(r.pass_rate),
                parseFloat(r.ppa2),
                parseFloat(r.total_ppa2),
                parseFloat(r.passing_ppa2),
                parseFloat(r.rushing_ppa2),
                parseFloat(r.standard_down_ppa2),
                parseFloat(r.passing_down_ppa2),
                parseFloat(r.success_rate2),
                parseFloat(r.standard_success_rate2),
                parseFloat(r.passing_success_rate2),
                parseFloat(r.passing_success2),
                parseFloat(r.rushing_success2),
                parseFloat(r.explosiveness2),
                parseFloat(r.pass_explosiveness2),
                parseFloat(r.rush_explosiveness2),
                parseFloat(r.pass_rate2)
            ]
        };

        const normalized = renormalizeData(trainingData);
        const normalizedResult = probabilityNetwork.activate(normalized);

        let result = normalizedResult[0];

        if (result) {
            await db.tx(async t => {
                await t.batch([
                    t.none('UPDATE game_team SET win_prob = $1 WHERE id = $2', [result, r.game_team1_id]),
                    t.none('UPDATE game_team SET win_prob = $1 WHERE id = $2', [1 - result, r.game_team2_id])
                ]);
            });
        }
    };

    const updatePlayWP = async (game) => {
        let plays = await db.any(`
            SELECT 	g.id,
                    p.id AS play_id,
                    p.play_text,
                    home_team.id AS home_id,
                    home_team.school AS home,
                    away_team.id AS away_id,
                    away_team.school AS away,
                    CASE 
                        WHEN home.team_id = p.offense_id AND p.scoring = false THEN home_team.school
                        WHEN home.team_id = p.defense_id AND p.scoring = true THEN home_team.school
                        ELSE away_team.school
                    END AS offense,
                    COALESCE(gl.spread, 0) AS spread,
                    CASE
                        WHEN home.team_id = p.offense_id AND p.scoring = false THEN COALESCE(gl.spread, 0)
                        WHEN home.team_id = p.defense_id AND p.scoring = true THEN COALESCE(gl.spread, 0)
                        ELSE -COALESCE(gl.spread, 0)
                    END AS offensive_spread,
                    p.home_score,
                    p.away_score,
                    CASE
                        WHEN home.team_id = p.offense_id AND p.scoring = false THEN (p.away_score - p.home_score)
                        WHEN home.team_id = p.defense_id AND p.scoring = true THEN (p.away_score - p.home_score)
                        ELSE (p.home_score - p.away_score)
                    END AS margin,
                    ROW_NUMBER() OVER(ORDER BY d.drive_number, p.play_number) - 1 AS play_number,
                    CASE 
                        WHEN home.team_id = p.offense_id AND p.scoring = false THEN 1 
                        WHEN home.team_id = p.defense_id AND p.scoring = true THEN 1
                        ELSE 0 
                    END AS home_ball,
                    CASE
                        WHEN home.team_id = p.offense_id AND p.scoring = false THEN p.home_timeouts
                        WHEN home.team_id = p.defense_id AND p.scoring = true THEN p.home_timeouts
                        ELSE p.away_timeouts
                    END AS offense_timeouts,
                    CASE
                        WHEN home.team_id = p.offense_id AND p.scoring = false THEN p.away_timeouts
                        WHEN home.team_id = p.defense_id AND p.scoring = true THEN p.away_timeouts
                        ELSE p.home_timeouts
                    END AS defense_timeouts,
                    p.down,
                    p.distance,
                    CASE
                        WHEN (home.team_id = p.offense_id) OR (away.team_id = p.defense_id) THEN (100 - p.yard_line)
                        ELSE p.yard_line 
                    END AS yards_to_goal,
                    p.period,
                    (((4 - p.period) * 60 * 15) + EXTRACT(epoch FROM p.clock)) as game_seconds_remaining,
                    CASE
                        WHEN p.period IN (2, 4) THEN EXTRACT(epoch FROM p.clock)
                        ELSE EXTRACT(epoch FROM p.clock) + (60 * 15)
                    END AS half_seconds_remaining,
                    CASE
                        WHEN home.team_id = p.offense_id AND p.scoring = false AND home.winner = true THEN 1
                        WHEN home.team_id = p.defense_id AND p.scoring = true AND home.winner = true THEN 1
                        WHEN away.team_id = p.offense_id AND p.scoring = false AND away.winner = true THEN 1
                        WHEN away.team_id = p.defense_id AND p.scoring = true AND away.winner = true THEN 1
                        ELSE 0
                    END AS offense_winner,
                    d.drive_number,
                    p.play_number
                FROM game AS g
                INNER JOIN game_team AS home ON g.id = home.game_id AND home.home_away = 'home'
                INNER JOIN team AS home_team ON home.team_id = home_team.id
                INNER JOIN game_team AS away ON g.id = away.game_id AND away.home_away = 'away'
                INNER JOIN team AS away_team ON away.team_id = away_team.id
                INNER JOIN drive AS d ON g.id = d.game_id
                INNER JOIN play AS p 
                    ON d.id = p.drive_id 
                        AND p.play_type_id NOT IN (12,13,15,16,21,43,53,56,57,61,62,65,66,999,78)
                        AND p.yard_line <= 99 
                        AND p.yard_line >= 1
                        AND p.down > 0 
                        AND p.down < 5 
                        AND p.distance <= CASE WHEN (home.team_id = p.offense_id) OR (away.team_id = p.defense_id) THEN (100 - p.yard_line) ELSE p.yard_line END
                        AND p.distance >= 1
                LEFT JOIN game_lines AS gl ON g.id = gl.game_id AND gl.lines_provider_id = 1004
            WHERE g.id = $1 AND p.home_win_prob IS NULL
        `, [game.id]);

        if (plays && plays.length) {
            const regulationPlays = plays.filter(p => p.period < 5);
            const otPlays = plays.filter(p => p.period > 4);

            if (regulationPlays && regulationPlays.length) {
                for (let play of regulationPlays) {
                    play.adjusted_margin = play.margin + play.offensive_spread * (play.game_seconds_remaining / 3600);
                }

                const res = await axios.post(`http://${flaskBaseUrl}/wp`, regulationPlays).catch(err => {
                    console.error(err);
                });

                let helper = pgp();
                const cs = new helper.helpers.ColumnSet(['?id', 'home_win_prob'], {
                    table: 'play'
                });
                const sql = helper.helpers.update(res.data.data.map(d => ({
                    id: d.play_id,
                    home_win_prob: d.win_prob
                })), cs) + ' WHERE v.id = t.id';

                await db.none(sql.replace(/'/g, ''));
            }

            if (otPlays && otPlays.length) {
                for (let play of otPlays) {
                    play.offensive_spread *= 1.0;
                }

                const res = await axios.post(`http://${flaskBaseUrl}/wp/ot`, otPlays).catch(err => {
                    console.error(err);
                });

                let helper = pgp();
                const cs = new helper.helpers.ColumnSet(['?id', 'home_win_prob'], {
                    table: 'play'
                });
                const sql = helper.helpers.update(res.data.data.map(d => ({
                    id: d.play_id,
                    home_win_prob: d.win_prob
                })), cs) + ' WHERE v.id = t.id';

                await db.none(sql.replace(/'/g, ''));
            }

            const excitement = await db.one(`
                WITH plays AS (
                    SELECT ROW_NUMBER() OVER(ORDER BY d.drive_number, p.play_number), p.home_win_prob, gt.winner
                    FROM game AS g
                        INNER JOIN game_team AS gt ON g.id = gt.game_id AND gt.home_away = 'home'
                        INNER JOIN drive AS d ON g.id = d.game_id
                        INNER JOIN play AS p ON d.id = p.drive_id
                    WHERE g.id = $1 AND p.home_win_prob IS NOT NULL
                )
                SELECT SUM(ABS(COALESCE(nxt.home_win_prob, CASE WHEN nxt.winner THEN 1 ELSE 0 END) - p.home_win_prob)) AS excitement
                FROM plays AS p
                    LEFT JOIN plays AS nxt ON p.row_number = (nxt.row_number - 1)
            `, [game.id]);

            await db.none('UPDATE game SET excitement = $1 WHERE id = $2', [excitement.excitement, game.id]);
        }
    };

    return {
        updateGameProbability,
        updatePlayWP
    };
}