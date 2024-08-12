import React from 'react';
import { Spin } from 'antd';

const Loading = ({ children, isPending }) => {
    return (
        <Spin spinning={isPending} delay={500}>
            {children}
        </Spin>
    )
}

export default Loading;
