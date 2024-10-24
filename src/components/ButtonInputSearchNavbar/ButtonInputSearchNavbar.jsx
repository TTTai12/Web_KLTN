
import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButttonInputSearchNavbar = (props) => {
  const {
    size, placeholder, textButton,
    bordered, backgroundColorInput = '#fff',
    backgroundColorButton = 'rgb(13, 92, 182)',
    colorButton = '#fff'
  } = props

  return (
    <div className="col-lg-4 col-4 text-left">
    <form action="">
      <div className="input-group">
        <input
          type="text"
          className="form-control" // Class từ Bootstrap cho input
          placeholder={placeholder} // Đảm bảo placeholder được truyền vào
          style={{ backgroundColor: backgroundColorInput }} // Sử dụng backgroundColorInput nếu cần
          {...props} // Chuyển tiếp các props khác nếu có
        />
        <div className="input-group-append">
          <span className="input-group-text bg-transparent text-primary">
            <i className="fa fa-search" style={{ color: '#D19C97' }}></i> {/* Thay đổi icon */}
          </span>
        </div>
      </div>
    </form>
  </div>
  
  )
}

export default ButttonInputSearchNavbar