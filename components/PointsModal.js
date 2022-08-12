import React from "react";
import modalStyle from "../stylesheets/modalStyle";

class PointsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: 0,
            value: ""
        };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {    this.setState({value: event.target.value});  }
    handleSubmit(event) {
      alert('Map imported: ' + this.state.value);
      this.props.importMap(this.state.value);
      event.preventDefault();
    }
    getWindow(tab) {
        if (tab === 0) {
            return (
                <React.Fragment>
                    <div className="results-field">
                            {this.props.coordinateString}
                        </div>
                    <div className="utility-button" onClick={() => this.props.hideModal && this.props.hideModal()}>Done</div>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <form className="modal-content" onSubmit={this.handleSubmit}>        
                        <label className="label">
                            Import Text:
                        <input className="results-field" type="text" value={this.state.value} onChange={this.handleChange} />        
                        </label>
                        <input className="utility-button" type="submit" value="Submit" />
                    </form>
                    <div className="utility-button" onClick={() => this.props.hideModal && this.props.hideModal()}>Done</div>
            </React.Fragment> 
            /*
                <form onSubmit={this.handleSubmit}>        <label>
                Name:
                <input type="text" value={this.state.Value} onChange={this.handleChange} />        </label>
                <input type="submit" value="Submit" />
                </form> */
            )
        }
    }
    render() {
        let {selectedTabIndex} = this.state;
        return (
            <div className="modal">
                <section className="modal-content">
                <div className="tab-bar">
                    <div 
                        className={selectedTabIndex === 0 ? "tab-bar-item selected" : "tab-bar-item"}
                        onClick={() => this.setState({selectedTabIndex: 0})}
                    >
                        Export Build Order
                    </div>
                    <div 
                        className={selectedTabIndex === 1 ? "tab-bar-item selected" : "tab-bar-item"}
                        onClick={() => this.setState({selectedTabIndex: 1})}
                    >
                        Import Build Order
                    </div>
                </div>
                {this.getWindow(selectedTabIndex)}
                </section>
                {modalStyle}
            </div>
        )
    }
}

export default PointsModal;