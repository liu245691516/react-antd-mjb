import React, { Component } from 'react'
import { Tabs } from 'antd';
import { withRouter } from 'react-router-dom';

const { TabPane } = Tabs;

class TopTabs extends Component {
    render(){
        const { location } = this.props;
        const name = location.pathname.split('resource/')[1];
        return (
            <Tabs defaultActiveKey={name} onChange={this.callback}>
                <TabPane tab="软文媒体" key="article"></TabPane>
                <TabPane tab="自媒体" key="wemedia"></TabPane>
                <TabPane tab="微信" key="wechat"></TabPane>
            </Tabs>
        )
    }

    callback = (key) => {
        this.props.history.push(`/resource/${key}`);
    }
}

export default withRouter(TopTabs);