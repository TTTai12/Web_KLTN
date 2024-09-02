import React from "react";
import {
  InformationContainer,
  Title,
  SmallLinks,
  Link,
  CertifiedImage,
  StyledAnchor,
  Icon,
  FooterWrapper,
  Fontstyle,
  style,
} from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCcVisa,
  faCcMastercard,
  faCcPaypal,
  faCcJcb,
  faFacebook,
  faYoutube,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const FooterComponent = ({
  supportLinks,
  StoreLinks,
  CooperationLinks,
  PaymentLinks,
}) => {
  return (
    <div>
      <InformationContainer>
        <div>
          <Title>Hỗ trợ khách hàng</Title>
          <SmallLinks>
            {supportLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                {link.text}
              </Link>
            ))}
          </SmallLinks>
        </div>
        <div>
          <Title>Về Nhân Tài Store</Title>
          <SmallLinks>
            {StoreLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                {link.text}
              </Link>
            ))}
          </SmallLinks>
        </div>
        <div>
          <Title>Hợp tác và liên kết</Title>
          <SmallLinks>
            {CooperationLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                {link.text}
              </Link>
            ))}
          </SmallLinks>
          <StyledAnchor
            href="https://example.com/link1"
            rel="nofollow noreferrer"
            aria-label=""
            target="_blank"
          >
            <CertifiedImage
              src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong-2.png"
              alt="bo-cong-thuong-2"
            />
          </StyledAnchor>
          <StyledAnchor
            href="https://example.com/link1"
            rel="nofollow noreferrer"
            aria-label=""
            target="_blank"
          >
            <CertifiedImage
              src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg"
              alt="bo-cong-thuong-2"
            />
          </StyledAnchor>
          <StyledAnchor
            href="https://example.com/link1"
            rel="nofollow noreferrer"
            aria-label=""
            target="_blank"
          >
            <CertifiedImage
              src="https://images.dmca.com/Badges/dmca_protected_sml_120y.png?ID=388d758c-6722-4245-a2b0-1d2415e70127"
              alt="bo-cong-thuong-2"
            />
          </StyledAnchor>
        </div>
        <div>
          <Title>Phương thức thanh toán</Title>
          <p className="payment">
            <Icon className="icon">
              <FontAwesomeIcon icon={faCcVisa} />
              <FontAwesomeIcon icon={faCcMastercard} />
              <FontAwesomeIcon icon={faCcPaypal} />
              <FontAwesomeIcon icon={faCcJcb} />
            </Icon>
          </p>
          <Title>Dịch vụ giao hàng</Title>
          <StyledAnchor>
            <img
              src="https://down-vn.img.susercontent.com/file/6e3be504f08f88a15a28a9a447d94d3d"
              alt="bo-cong-thuong-2"
            />
          </StyledAnchor>
        </div>
        <div>
          <Title>Kết nối với chúng tôi </Title>
          <p className="payment">
            <Icon className="icon">
              <a
                href="https://example.com/link1"
                rel="nofollow noreferrer"
                aria-label=""
                target="_blank"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="https://example.com/link1"
                rel="nofollow noreferrer"
                aria-label=""
                target="_blank"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a
                href="https://example.com/link1"
                rel="nofollow noreferrer"
                aria-label=""
                target="_blank"
              >
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
            </Icon>
          </p>
        </div>
        <div>
          <Title>Tải úng dụng trên điện thoại</Title>
          <Fontstyle>
            <img
              src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/qrcode.png"
              width="80"
              height="80"
              alt="tiki-qr"
            />
            <FooterWrapper>
              <img
                src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/appstore.png"
                width="122"
                alt="tiki-app-store"
              />
              <img
                src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/playstore.png"
                width="122"
                alt="tiki-google-play"
              />
            </FooterWrapper>
          </Fontstyle>
        </div>
      </InformationContainer>
    </div>
  );
};

export default FooterComponent;