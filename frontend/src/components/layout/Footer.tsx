'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { theme } from '@/theme';

const FooterContainer = styled.footer`
  background: ${theme.colors.dark[900]};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[12]} ${theme.spacing[6]};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[8]};
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
`;

const FooterTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.dark[50]};
  margin-bottom: ${theme.spacing[2]};
`;

const FooterLink = styled(Link)`
  color: ${theme.colors.dark[400]};
  text-decoration: none;
  transition: color 150ms ease-in-out;

  &:hover {
    color: ${theme.colors.dark[200]};
  }
`;

const FooterText = styled.p`
  color: ${theme.colors.dark[400]};
  font-size: ${theme.typography.sizes.sm};
  line-height: 1.6;
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: ${theme.spacing[6]} ${theme.spacing[6]} 0;
  text-align: center;
`;

const Copyright = styled.p`
  color: ${theme.colors.dark[500]};
  font-size: ${theme.typography.sizes.sm};
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Atomic Rose Tools</FooterTitle>
          <FooterText>
            Premium psytrance sample packs, MIDI files, and acapellas for producers and DJs.
          </FooterText>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Products</FooterTitle>
          <FooterLink href="/sample-packs">Sample Packs</FooterLink>
          <FooterLink href="/midi-packs">MIDI Packs</FooterLink>
          <FooterLink href="/acapellas">Acapellas</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Legal</FooterTitle>
          <FooterLink href="/terms">Terms of Service</FooterLink>
          <FooterLink href="/privacy">Privacy Policy</FooterLink>
          <FooterLink href="/cookies">Cookie Policy</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Account</FooterTitle>
          <FooterLink href="/profile">My Account</FooterLink>
          <FooterLink href="/orders">My Orders</FooterLink>
          <FooterLink href="/downloads">Downloads</FooterLink>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} Atomic Rose Tools. All rights reserved.
        </Copyright>
      </FooterBottom>
    </FooterContainer>
  );
}
