import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">JSN English Learning</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Led by Dr. S. Jerald Sagaya Nathan, JSN English Learning is Tamil
              Nadu's premier TRB coaching center, dedicated to helping aspiring
              teachers achieve their dreams through comprehensive study
              materials and expert guidance.
            </p>

            {/* Founder Info */}
            <div className="bg-gray-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-blue-400" />
                <span className="font-semibold text-blue-400">
                  Founder & Director
                </span>
              </div>
              <p className="text-white font-medium">
                Dr. S. Jerald Sagaya Nathan, Ph.D.
              </p>
              <p className="text-gray-300 text-sm">
                Assistant Professor of English
              </p>
              <p className="text-gray-300 text-sm">
                St. Joseph's College (Autonomous), Tiruchirappalli
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  <span>Ph.D., UGC-NET, SET</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>15+ Research Papers</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">jsnathan1981@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">
                  +91 98432 87913 / +91 96292 87913
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  245/8, Astalakshmi Avenue, First Main Road, Vasan Valley,
                  <br />
                  Rettaivaikal Post, Tiruchirappalli – 620102, Tamil Nadu, India
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/materials"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Study Materials
                </Link>
              </li>
              <li>
                <Link
                  to="/tests"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Online Tests
                </Link>
              </li>
              <li>
                <Link
                  to="/youtube"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  YouTube Channel
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  About Dr. Nathan
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Excellence */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Academic Excellence</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300">📚 UG & PG TRB Preparation</li>
              <li className="text-gray-300">🎓 Expert Faculty Guidance</li>
              <li className="text-gray-300">
                📖 Comprehensive Study Materials
              </li>
              <li className="text-gray-300">💯 Proven Success Rate</li>
              <li className="text-gray-300">🏆 500+ Successful Students</li>
              <li className="text-gray-300">🔬 Research-Based Teaching</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <p className="text-gray-400 text-sm">
                © 2024 JSN English Learning. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Founded by Dr. S. Jerald Sagaya Nathan | Empowering future
                teachers across Tamil Nadu
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-gray-400 text-sm">
                🌟 Excellence in English Education & TRB Coaching
              </p>
              <p className="text-gray-500 text-xs mt-1">
                UGC-NET Qualified Faculty | Research-Driven Methodology
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
