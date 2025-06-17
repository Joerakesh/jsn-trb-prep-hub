
import { BookOpen, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">JSN Academy</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Tamil Nadu's premier TRB coaching center, dedicated to helping aspiring teachers achieve their dreams through comprehensive study materials and expert guidance.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">rakeshjoe52@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">+91 63815 74827</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/materials" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Study Materials
                </Link>
              </li>
              <li>
                <Link to="/samples" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Sample Materials
                </Link>
              </li>
              <li>
                <Link to="/tests" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Online Tests
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <span className="text-gray-300">UG TRB Materials</span>
              </li>
              <li>
                <span className="text-gray-300">PG TRB Materials</span>
              </li>
              <li>
                <span className="text-gray-300">Mock Tests</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 JSN Academy. All rights reserved. Empowering future teachers across Tamil Nadu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
