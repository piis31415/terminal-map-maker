import React from "react";
import modalStyle from "../stylesheets/modalStyle";

class PointsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: 0
        }
    }
    render() {
        let {selectedTabIndex} = this.state;
        let myPoints = this.props.coordinateString
        return (
            <div className="modal">
                <section className="modal-content">
                    <div className="tab-bar">
                        <div 
                            className={selectedTabIndex === 0 ? "tab-bar-item selected" : "tab-bar-item"}
                            onClick={() => this.setState({selectedTabIndex: 0})}
                        >
                            My points
                        </div>
                    </div>
                    <div className="results-field">
                        {
                                myPoints
                        }
                    </div>
                    <div className="utility-button" onClick={() => this.props.hideModal && this.props.hideModal()}>Done</div>
                </section>
                {modalStyle}
            </div>
        )
    }
}

export default PointsModal;