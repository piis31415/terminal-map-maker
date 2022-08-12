import React from "react";
import Filter from "./components/filter";
import Destructor from "./components/destructor";
import Encryptor from "./components/encryptor";
import mapMakerStyle from "./stylesheets/mapMakerStyle";
import GameMap from "./components/GameMap";
import ItemType from "./helpers/ItemType";
import mapItemStyle from "./stylesheets/mapItemStyle";
import GroupItem from "./components/GroupItem";
import {groupColors, colorNames} from "./helpers/groupColors";
import CustomHead from "./components/CustomHead";
import PointsModal from "./components/PointsModal";

class MapMaker extends React.Component {
    // initializes an empty representation of the map
    getInitGameMap() {
        let gameMap = [];
        for (let i = 0; i < 28; i++) {
            gameMap.push([]);
            for (let j = 0; j < 28; j++) {
                let x = j;
                let y = 27 - i;
                if (x < 14 && y < 14 && -x + 13 > y) gameMap[i].push({ type: ItemType.NON_EXISTENT, colorIndex: 0, playerIndex: 0, upgraded: false});
                else if (x < 14 && y > 13 && x + 14 < y) gameMap[i].push({ type: ItemType.NON_EXISTENT, colorIndex: 0, playerIndex: 1, upgraded: false});
                else if (x > 13 && y < 14 && x - 14 > y) gameMap[i].push({ type: ItemType.NON_EXISTENT, colorIndex: 0, playerIndex: 0, upgraded: false});
                else if (x > 13 && y > 13 && -x + 41 < y) gameMap[i].push({ type: ItemType.NON_EXISTENT, colorIndex: 0, playerIndex: 1, upgraded: false});
                else if (y > 13) gameMap[i].push({ type: ItemType.NON_EXISTENT2, colorIndex: 0, playerIndex: 0, upgraded: false});
                else if (y > 13) gameMap[i].push({ type: ItemType.VALID, colorIndex: 0, playerIndex: 1, upgraded: false});
                else gameMap[i].push({ type: ItemType.VALID, colorIndex: 0, playerIndex: 0, upgraded: false});
            }
        }
        /* 
        gameMap is a 2-d array with each item containing an object: {
            type: ItemType // defines if a destructor, encryptor etc. is placed down.
            colorIndex: Number (integer) // it's index defines the group that it is in.
            playerIndex: Number // defines player
            upgraded: bool // defines upgrade status
        }
        */
        return gameMap;
    }
    constructor(props) {
        super(props);
        this.state = {
            gameMap: this.getInitGameMap(),
            currentHoveredCoordinate: undefined,
            firewallType: ItemType.FILTER,
            groups: ["#FF22A1"],
            selectedGroupIndex: 0,
            showModal: false,
            coordinateString: "{}",
            buildOrder: []
        };
        this.importMap = this.importMap.bind(this);
    }
    render() {
        let firewallItemClass = "firewall-item";
        let firewallItemSelected = "firewall-item firewall-item-selected";
        let groupColor = groupColors[this.state.selectedGroupIndex]; // defines what colour to render each new object
        return (
            <div className="map-maker-container">
                <CustomHead />
                {
                    // modal for showing the user's points
                    this.state.showModal && <PointsModal 
                        importMap = {this.importMap}
                        coordinateString={this.state.coordinateString}
                        hideModal={() => this.setState({showModal: false})}
                    />
                }
                { /* Game Map */ }
                <GameMap gameMap={this.state.gameMap} mapItemClick={this.mapItemClick} mapItemHover={this.mapItemHover}/>
                
                { /* Options panel */}
                <div className="map-maker-options-container">
                    <div className="container-title">Options</div>
                    { /* Firewalls container to choose which type of firewall to place on map */ }
                    <div className="firewall-title">Choose Placement Marker</div>
                    <div className="firewalls-container options-container">
                        <div
                            className={
                                this.state.firewallType === ItemType.FILTER ? firewallItemSelected : firewallItemClass}
                            onClick={() => this.setFirewallItem(ItemType.FILTER)}
                        >
                            <Filter fillColor={groupColor}/>
                        </div>
                        <div
                            className={this.state.firewallType === ItemType.ENCRYPTOR ? firewallItemSelected : firewallItemClass}
                            onClick={() => this.setFirewallItem(ItemType.ENCRYPTOR)}
                        >
                            <Encryptor fillColor={groupColor}/>
                        </div>
                        <div 
                            className={this.state.firewallType === ItemType.DESTRUCTOR ? firewallItemSelected : firewallItemClass}
                            onClick={() => this.setFirewallItem(ItemType.DESTRUCTOR)}
                        >
                            <Destructor fillColor={groupColor}/>
                        </div>
                        <div
                            className={this.state.firewallType === ItemType.UPGRADE ? firewallItemSelected : firewallItemClass}
                            onClick={() => this.setFirewallItem(ItemType.UPGRADE)}
                        >
                            <div className="up" style={{color: groupColor}}>^</div>
                        </div>
                        { /* TODO: undo button, remember to change line 56 in mapMakerStyle.js to adjust number of cols
                        <div 
                            className={this.state.firewallType === ItemType.VALID ? firewallItemSelected : firewallItemClass}
                            onClick={() => this.setFirewallItem(ItemType.VALID)}
                        >
                            <div className="x" style={{color: groupColor}}>&#60;</div>
                        </div>
                        */ }
                    </div>
                        { /* Each of the colors group - lets user pick which color to use */ }
                    {/*
                    <div className="groups-container options-container">
                        {
                            this.state.groups.map((group, i) => <GroupItem 
                                key={i} 
                                color={groupColors[i]} 
                                selected={this.state.selectedGroupIndex === i}
                                onClick={() => this.setSelectedGroup(i)}
                            />)
                        }
                         <div className="group-item add-group-item" onClick={() => this.addGroup()}><div>+</div></div> 
                    </div> */}
                    { /* Utility buttons (get all points and remove all points) */ }
                    <div className="export-points-container options-container">
                        <div className="utility-button" onClick={() => this.getPointsAsCode()}>Import/Export</div>
                        <div className="utility-button" onClick={() => this.resetMap()}>Remove All Points</div>
                    </div>
                    { /* Displays the current coordinate the user is hovering on */ }
                    <div className="current-coordinate-container options-container">
                        <div className="current-coordinate-title">Current Coordinate</div>
                        <div className="current-coordinate-value">{this.state.currentHoveredCoordinate && this.state.currentHoveredCoordinate.x + ", " + this.state.currentHoveredCoordinate.y}</div>
                    </div>
                </div>

                {/* Styles imported from stylesheets */}
                {mapMakerStyle}
                {mapItemStyle}
            </div>
        )
    }
    
    mapItemClick = (coordinate) => {
        // convert the x,y coordinates to i,j for indexing the array
        let i = 27 - coordinate.y;
        let j = coordinate.x;
        
        // only execute if the selected coordinate is a valid coordinate or represents a change or a valid action
        if (this.state.firewallType === undefined) return;
        // if (this.state.gameMap[i][j].type === ItemType.NON_EXISTENT) return;
        // if (this.state.gameMap[i][j].type === this.state.firewallType && this.state.gameMap[i][j].colorIndex === this.state.selectedGroupIndex) return;
        if ((this.state.gameMap[i][j].type === ItemType.VALID || this.state.gameMap[i][j].upgraded) && this.state.firewallType === ItemType.UPGRADE) return;
        if (this.state.gameMap[i][j].type !== ItemType.VALID && this.state.firewallType !== ItemType.UPGRADE) return;

        
        // create copy of the map
        let mapCopy = this.state.gameMap;
        // change the coordinate selected to current selected options
        mapCopy[i][j] = {
            type: ((this.state.firewallType === ItemType.UPGRADE) ? mapCopy[i][j].type : this.state.firewallType),
            colorIndex: this.state.selectedGroupIndex,
            playerIndex: mapCopy[i][j].playerIndex,
            upgraded: (this.state.firewallType === ItemType.UPGRADE)
        }

        let typeString = "UPGRADE";

        switch (this.state.firewallType) {
            case ItemType.DESTRUCTOR: 
                typeString = "TURRET"
                break; 
            case ItemType.ENCRYPTOR: 
                typeString = "SUPPORT"
                break;
            case ItemType.FILTER: 
                typeString = "WALL"
                break;
        }
            
        this.state.buildOrder.push("{" + typeString + ", " + coordinate.x + ", " + coordinate.y + "}");
        // update state (which updates the map)
        this.setState({
            gameMap: mapCopy
        })
    }
    mapItemHover = (coordinate) => {
        // updates the current hovered coordinate so the user knows which coordinate is hovered over
        if (this.state.currentHoveredCoordinate && coordinate.x === this.state.currentHoveredCoordinate.x && coordinate.y === this.state.currentHoveredCoordinate.y) return;
        this.setState({
            currentHoveredCoordinate: coordinate
        })
    }

    setFirewallItem(itemType) {
        // when the user selects a specific item in the firewall options panel, update the state
        if (this.state.firewallType === itemType) return;
        this.setState({
            firewallType: itemType
        })
    }

    setSelectedGroup(index) {
        // when the user selects a specific item in the groups options panel, update the state
        if (index === this.state.selectedGroupIndex) return;
        this.setState({
            selectedGroupIndex: index
        })
    }

    addGroup() {
        // add a new group if not all groups are already added
        if (this.state.groups.length < groupColors.length) {
            let groups = this.state.groups;
            groups.push(groupColors[this.state.groups.length]);
            this.setState({
                groups: groups,
                selectedGroupIndex: groups.length - 1
            })
        }
    }

    // reset the map to start fresh and new mapping
    resetMap() {
        this.setState({
            gameMap: this.getInitGameMap(),
            coordinateString: "{}",
            buildOrder: []
        })
    }

    // undo last move
    undo() {

    }

    importMap(str) {
        // make sure str is long enough
        let string = str.replace(/\s/g,'');
        if (str.length < 2) return;
        string = string.slice(1,-1);
        let mapString = string; // create unprocessed copy for use for state change
        if (string === "") {
            this.resetMap();
            return;
        }
        string = string.slice(1,-1);
        let arr = string.split("},{").map(m => m.split(",")).map(m => [m[0], parseInt(m[1]), parseInt(m[2])]);
        let map = this.getInitGameMap();
        let unitType = ItemType.UPGRADE;
        let tmpBuildOrder = [];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            switch (item[0]) {
                case "TURRET":
                    unitType = ItemType.DESTRUCTOR
                    break; 
                case "SUPPORT": 
                    unitType = ItemType.ENCRYPTOR
                    break;
                case "WALL": 
                    unitType = ItemType.FILTER
                    break;
                case "UPGRADE":
                    unitType = ItemType.UPGRADE
                    break;
            }
            tmpBuildOrder.push("{" + item[0] + ", " + item[1] + ", " + item[2] + "}");
            map[27 - item[2]][item[1]] = {
                type: ((unitType === ItemType.UPGRADE) ? map[27 - item[2]][item[1]].type : unitType),
                colorIndex: this.state.selectedGroupIndex,
                playerIndex: map[27 - item[2]][item[1]].playerIndex,
                upgraded: (unitType === ItemType.UPGRADE)
            }
        }
        this.setState({
            gameMap: map,
            currentHoveredCoordinate: undefined,
            firewallType: ItemType.FILTER,
            groups: ["#FF22A1"],
            selectedGroupIndex: 0,
            showModal: false,
            coordinateString: mapString,
            buildOrder: tmpBuildOrder
        })
    }

    // get the currently selected points and format into string to be outputted for the user
    getPointsAsCode() {
        let {gameMap} = this.state;
        let order = this.state.buildOrder;
        let string = "{";
        if (order.length) {
            for (let i = 0; i < order.length-1; i++) {
                string += order[i] + ", ";
            } 
            string += order.slice(-1) + "}"
        } else {
            string = "{}";
        }
        /*
        let filtered = [];
        gameMap.forEach((row, i) => row.forEach((item, j) => {
            if (item.type === ItemType.DESTRUCTOR || item.type === ItemType.ENCRYPTOR || item.type === ItemType.FILTER)
                filtered.push({
                    x: j,
                    y: 27 - i,
                    type: item.type,
                    colorIndex: item.colorIndex,
                    playerIndex: item.playerIndex,
                    upgraded: item.upgraded
                });
        }))

        // mapped function
        const mappedToStringArray = (obj, colorIndex) => {
            let masterString = "";
            for (let item in obj) {
                let val = obj
                                .trim()
                                .split("   ")
                                .reduce((prevStr, currentStr) => prevStr === "{" ? prevStr + currentStr : prevStr + ", " + currentStr, "{") + "}";
                if (val.length > 2) {
                    // filters if a string is simply: []
                    if (masterString) masterString += "\n";
                    masterString += colorNames[colorIndex] + "_strategy = " + val;
                }
            }
            return masterString;
        }

        // converting coordinates to string
        myCoordinatesAsStrings = myCoordinatesAsStrings.map(mappedToStringArray);
        enemyCoordinatesAsStrings = enemyCoordinatesAsStrings.map(mappedToStringArray);

        
        */
        console.log(string);
        this.setState({
            showModal: true,
            coordinateString: string
        })
    }
}

export default MapMaker;