import React, { useEffect, useState } from "react";
import {
  getAllReviews,
  approveProductReview,
  deleteProductReview,
} from "../../services/ReviewService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TableComponent from "../TableComponent/TableComponent";
import * as message from "../../components/Message/Message";
import { Modal } from "antd";

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReviewIds, setSelectedReviewIds] = useState([]);
  const [rowSelected, setRowSelected] = useState('');
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const queryClient = useQueryClient();

  // Fetch reviews
  const { data: reviewsData, isLoading: isPendingReviews, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews"], // Đảm bảo queryKey là mảng
    queryFn: getAllReviews,
  });

  useEffect(() => {
    if (reviewsData) {
      setReviews(reviewsData);
    }
  }, [reviewsData]);

  const mutationApprove = useMutation({
    mutationFn: (reviewId) => approveProductReview(reviewId),
    onSuccess: () => {
      message.success("Review approved successfully");
      refetchReviews();
    },
    onError: () => {
      message.error("Error approving review");
    }
  });

  const mutationDelete = useMutation({
    mutationFn: (reviewId) => deleteProductReview(reviewId),
    onSuccess: () => {
      message.success("Review deleted successfully");
      refetchReviews();
      setIsModalOpenDelete(false);
    },
    onError: () => {
      message.error("Error deleting review");
    }
  });

  const mutationDeleteMany = useMutation({
    mutationFn: (reviewIds) => {
      return Promise.all(reviewIds.map((reviewId) => deleteProductReview(reviewId)));
    },
    onSuccess: () => {
      message.success("Reviews deleted successfully");
      refetchReviews();
      setSelectedReviewIds([]);
    },
    onError: () => {
      message.error("Error deleting multiple reviews");
    }
  });

  const handleApprove = (reviewId) => {
    mutationApprove.mutate(reviewId);
  };

  const handleDelete = () => {
    mutationDelete.mutate(rowSelected);
  };

  const handleDeleteManyReviews = () => {
    mutationDeleteMany.mutate(selectedReviewIds);
  };

  const columns = [
    { title: "#", dataIndex: "index", key: "index" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    { title: "Comment", dataIndex: "comment", key: "comment" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <button onClick={() => handleApprove(record._id)}>Approve</button>
          <button onClick={() => {
            setRowSelected(record._id);
            setIsModalOpenDelete(true);
          }}>Delete</button>
        </>
      ),
    },
  ];

  const dataTable = reviews.map((review, index) => ({
    ...review,
    index: index + 1,
  }));

  return (
    <div style={{ marginTop: "20px" }}>
      <TableComponent
        handleDeleteMany={handleDeleteManyReviews}
        columns={columns}
        isPending={isPendingReviews}
        data={dataTable}
        onRow={(record) => {
          return {
            onClick: () => {
              setSelectedReviewIds(prevIds => {
                if (prevIds.includes(record._id)) {
                  return prevIds.filter(id => id !== record._id);
                } else {
                  return [...prevIds, record._id];
                }
              });
            },
          };
        }}
      />
      <Modal
        title="Xác nhận xóa"
        visible={isModalOpenDelete}
        onOk={handleDelete}
        onCancel={() => setIsModalOpenDelete(false)}
      >
        <p>Bạn có chắc chắn muốn xóa đánh giá này không?</p>
      </Modal>
    </div>
  );
};

export default AdminReview;
