import React, { useEffect, useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { WrapperItemOrder, WrapperListOrder, WrapperHeaderItem, WrapperFooterItem, WrapperContainer, WrapperStatus } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as message from '../../components/Message/Message';

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  };
  const user = useSelector((state) => state.user);

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder,
    enabled: Boolean(state?.id && state?.token),
  });

  const { isPending, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleCancelOrder = (order) => {
    mutation.mutate(
      { id: order._id, token: state?.token, orderItems: order?.orderItems, userId: user.id },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const { isPending: isPendingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success();
    } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message);
    } else if (isErrorCancel) {
      message.error();
    }
  }, [isErrorCancel, isSuccessCancel]);

  const renderProduct = (data) => {
    return data?.map((item) => (
      <WrapperHeaderItem key={item?._id}>
        {/* <img
          src={item?.images?.[0]} // Hiển thị ảnh từ dữ liệu `orderItems`
          alt={item?.name}
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            border: '1px solid rgb(238, 238, 238)',
            padding: '2px',
          }}
        /> */}
        <div
          style={{
            width: 260,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginLeft: '10px',
          }}
        >
          {item?.name}
        </div>
        <span
          style={{
            fontSize: '13px',
            color: '#242424',
            marginLeft: 'auto',
          }}
        >
          {convertPrice(item?.price)}
        </span>
      </WrapperHeaderItem>
    ));
  };

  return (
    <Loading isPending={isPending || isPendingCancel}>
      <WrapperContainer>
        <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {data?.map((order) => (
              <WrapperItemOrder key={order?._id}>
                <WrapperStatus>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Trạng thái</span>
                  <div>
                    <span style={{ color: 'rgb(255, 66, 78)' }}>Giao hàng: </span>
                    <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</span>
                  </div>
                  <div>
                    <span style={{ color: 'rgb(255, 66, 78)' }}>Thanh toán: </span>
                    <span style={{ color: 'rgb(90, 32, 193)', fontWeight: 'bold' }}>{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</span>
                  </div>
                </WrapperStatus>
                {order?.orderItems && renderProduct(order.orderItems)} {/* Đảm bảo rằng orderItems được truyền */}
                <WrapperFooterItem>
                  <div>
                    <span style={{ color: 'rgb(255, 66, 78)' }}>Tổng tiền: </span>
                    <span style={{ fontSize: '13px', color: 'rgb(56, 56, 61)', fontWeight: 700 }}>{convertPrice(order?.totalPrice)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ButtonComponent
                      onClick={() => handleCancelOrder(order)}
                      size={20}
                      styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '170px',
                        border: 'none',
                        borderRadius: '4px',
                      }}
                      textButton={'Hủy Đơn Hàng'}
                      styleTextButton={{
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: '700',
                      }}
                    />
                    <ButtonComponent
                      onClick={() => handleDetailsOrder(order?._id)}
                      size={20}
                      styleButton={{
                        background: 'rgb(255, 57, 69)',
                        height: '48px',
                        width: '170px',
                        border: 'none',
                        borderRadius: '4px',
                      }}
                      textButton={'Xem chi tiết'}
                      styleTextButton={{
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: '700',
                      }}
                    />
                  </div>
                </WrapperFooterItem>
              </WrapperItemOrder>
            ))}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  );
};

export default MyOrderPage;
