
import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButttonInputSearch = (props) => {
  const {
    size, placeholder, textButton,
    bordered, backgroundColorInput = '#fff',
    backgroundColorButton = 'rgb(13, 92, 182)',
    colorButton = '#fff'
  } = props

  return (
    <div className="col-lg-6 col-6 text-left">
    <form action="">
      <div className="input-group" style={{ display: 'flex' }}>
        <InputComponent
          size={size}
          placeholder={placeholder} // Đảm bảo placeholder được truyền vào
          bordered={bordered}
          style={{ backgroundColor: backgroundColorInput }}
          className="form-control" // Sử dụng class cho input
          {...props} // Chuyển tiếp các props khác nếu có
        />
        <div className="input-group-append">
          <ButtonComponent
            size={size}
            styleButton={{
              background: backgroundColorButton,
              border: !bordered && 'none',
            }}
            icon={<SearchOutlined style={{ color: '#D19C97' }} />} // Không cần color cho icon
            textButton={textButton}
            styleTextButton={{ color: colorButton }}
            className="input-group-text bg-transparent text-primary" // Thêm class cho button
          />
        </div>
      </div>
    </form>
  </div>
  )
}

export default ButttonInputSearch