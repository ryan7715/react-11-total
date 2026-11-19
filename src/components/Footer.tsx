import styled from "styled-components";

const Foot = styled.footer`
  width: 100%;
  padding: 20px;
  margin-top: auto;
  text-align: center;

  background-color: ${({ theme }) => theme.color.muted};
  color: ${({ theme }) => theme.color.textSecondary};

  border-top: 1px solid ${({ theme }) => theme.color.border};

  p {
    font-size: 14px;
  }
`;

function Footer() {
  return (
    <Foot>
      <p>© 2026 Life Dashboard. All rights reserved.</p>
    </Foot>
  );
}

export default Footer;
