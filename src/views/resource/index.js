import React, { Component } from 'react'

import { Tabs } from 'antd';
import { withRouter, Route } from 'react-router-dom';

import ResourceArticle from '@/views/resource/article/index';
import ResourceWemedia from '@/views/resource/wemedia/index';

const { TabPane } = Tabs;

class Resource extends Component {
    render(){

        const { location } = this.props;
        const name = location.pathname.split('resource/')[1];

        return (
            <div className="shadow-radius">
                <Tabs defaultActiveKey={name} onChange={this.callback}>
                    <TabPane tab="软文媒体" key="article"></TabPane>
                    <TabPane tab="自媒体" key="wemedia"></TabPane>
                    <TabPane tab="微信" key="wechat"></TabPane>
                </Tabs>

                <Route path="/resource/article" component={ResourceArticle}></Route>
                <Route path="/resource/wemedia" component={ResourceWemedia}></Route>
            </div>
        )
    }

    callback = (key) => {
        this.props.history.push(`/resource/${key}`);
    }
}

export default withRouter(Resource);