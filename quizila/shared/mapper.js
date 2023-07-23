const objectMapper = require('object-mapper');


let mapper = {
    gameInsta:{
        "id": "id",
        "start_datetime": "start_datetime",
        "end_datetime": "start_datetime",
        "entry_count": "entry_count",
        "status":"status",
        "sb_gamemaster.name": "game_name",
        "sb_gamemaster.logo": "logo",
        "sb_gamemaster.recurrence": "recurrence",
        "sb_gamemaster.min_selection": "min_selection",
        "sb_gamemaster.max_selection": "max_selection",
        "sb_gamemaster.entries_allowed": "entries_allowed",
        "sb_gamemaster.entry_fees": "entry_fees",
        "sb_gamemaster.prize_pool": "prize_pool",
        "sb_gamemaster.min_entries": "min_entries",
        "sb_gamemaster.scrip_category_id": "scrip_category_id",
        "sb_gamemaster.prize_dis": "prize_dis",
        "sb_gamemaster.win_per": "win_per"
    },
    myGameResponse:{
        "id": "id",
        "FINCODE": "FINCODE",
        "SCRIPCODE": "FINCODE",
        "SCRIP_NAME": "SCRIP_NAME",
        "COMPNAME": "COMPNAME",
        "sb_part_scrip_map.ltp": "ltp",
        "sb_part_scrip_map.change_per": "change_per",
        "sb_part_scrip_map.scrip_cap":"scrip_cap",
        "sb_part_scrip_map.order_type":"order_type",
        "sb_part_scrip_map.points":"points",
        "sb_part_scrip_map.status":"status"
    },
    mygamesResp:{
        "game_instance_id": "game_instance_id",
        "game_name": "player_name",
        "amount": "amount",
        "rank": "rank",
        "points":"points",
        "status":"status",
        "sb_gameinstance.start_datetime":"start_datetime",
        "sb_gameinstance.end_datetime":"end_datetime",
        "sb_gameinstance.entry_count":"entry_count",
        "sb_gameinstance.sb_gamemaster.name": "game_name",
        "sb_gameinstance.sb_gamemaster.logo": "logo",
        "sb_gameinstance.sb_gamemaster.recurrence": "recurrence",
        "sb_gameinstance.sb_gamemaster.min_selection": "min_selection",
        "sb_gameinstance.sb_gamemaster.max_selection": "max_selection",
        "sb_gameinstance.sb_gamemaster.entries_allowed": "entries_allowed",
        "sb_gameinstance.sb_gamemaster.entry_fees": "entry_fees",
        "sb_gameinstance.sb_gamemaster.prize_pool": "prize_pool",
        "sb_gameinstance.sb_gamemaster.min_entries": "min_entries",
        "sb_gameinstance.sb_gamemaster.scrip_category_id": "scrip_category_id",
        "sb_gameinstance.sb_gamemaster.prize_dis": "prize_dis",
        "sb_gameinstance.sb_gamemaster.win_per": "win_per"
    },
    getMap:(games, gameInstancemap)=>{
        return objectMapper(games, gameInstancemap);
    }
};

module.exports = mapper;