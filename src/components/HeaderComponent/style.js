import { Grid } from "@mui/material";
import styled from "styled-components";
import { Row } from "antd";

export const WrapperHeader = styled(Row)`
  padding: 10px 120px;
  background-color: rgb(26, 148, 255);
  align-items: center;
  gap: 16px;
  flex-wrap:nowrap;
  width:100%;
`

export const WrapperTextHeader = styled.span`
  font-size:25px;
  color:#fff;
  font-weight:bold;
  text-align:left;
`
export const WrapperHeaderAccount = styled.div`     
  display: flex;
  align-items: center;
  color: #fff;
  gap:10px;
  
`
export const Span = styled.span` 
  font-size: 12px;
  color: #fff;
  while-space: nowrap;
`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
    }
`