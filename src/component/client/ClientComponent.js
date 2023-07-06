import React, {Component} from 'react'

import MainContains from "../main/MainContains";

class ClientComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {

            webSocket: null,
        }
    }

    render(){
        return(
            <MainContains />
        )
    }
}


export default ClientComponent