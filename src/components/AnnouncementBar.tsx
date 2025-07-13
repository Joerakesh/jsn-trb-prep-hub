import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <AlertCircle className="h-5 w-5 text-yellow-300 flex-shrink-0" />
          <div className="text-center flex-1">
            <p className="text-sm md:text-base font-medium">
              <a href="">
                🎉 <strong>New TRB Batch Starting Soon!</strong> Limited seats
                available.
              </a>
              {/* <span className="ml-2 inline-block bg-yellow-500 text-black px-2 py-1 rounded text-xs font-semibold">
                Early Bird Discount 30% OFF
              </span> */}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="text-white hover:bg-white/20 p-1 h-auto ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
