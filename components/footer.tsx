"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const footerRef = useRef(null);
  const socialLinksRef = useRef(null);

  useEffect(() => {
    // Animate footer elements on mount
    const ctx = gsap.context(() => {
      gsap.from(".footer-section", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Hover animation for social links
      const socialLinks = document.querySelectorAll(".social-link");
      socialLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            scale: 1.2,
            duration: 0.3,
            ease: "power2.out",
          });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-4">CraftRez</h3>
            <p className="text-muted-foreground">
              Create professional resumes with ease. Built with Next.js and
              modern web technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/chanakyha/resume-builder"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div ref={socialLinksRef} className="flex space-x-4">
              <a
                href="https://github.com/chanakyha"
                className="social-link text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://twitter.com/chanakyha"
                className="social-link text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://linkedin.com/in/chanakyha"
                className="social-link text-muted-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CraftRez. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
