import React from 'react';

const ReviewItem = ({ review }) => {
  return (
    <div className="media mb-4">
      <img
        src={review.avatar|| "img/user.jpg"}  // Dùng ảnh mặc định nếu không có ảnh người dùng
        alt="Image"
        className="img-fluid mr-3 mt-1"
        style={{ width: "45px" }}
      />
      <div className="media-body">
        <h6>
          {review.name}
          <small>
            {" "}
            - <i>{review.date}</i>
          </small>
        </h6>
        <div className="text-primary mb-2">
          {[...Array(5)].map((_, index) => (
            <i
              key={index}
              className={`${
                index < review.rating
                  ? "fas fa-star"
                  : index === review.rating
                  ? "fas fa-star-half-alt"
                  : "far fa-star"
              }`}
            ></i>
          ))}
        </div>
        <p>{review.content}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
