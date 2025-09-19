
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  verification_status: string;
}

const VerificationStatus = () => {
  const { user } = useAuth();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("verification_status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user?.id,
  });

  if (isLoading || !userProfile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return {
          badge: (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          ),
          title: "Account Verified",
          description: "Your account has been approved! You can now access all tests and materials.",
          cardClass: "border-green-200 bg-green-50",
        };
      case "rejected":
        return {
          badge: (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              <XCircle className="h-3 w-3 mr-1" />
              Rejected
            </Badge>
          ),
          title: "Verification Rejected",
          description: "Your account verification was rejected. Please contact support for assistance.",
          cardClass: "border-red-200 bg-red-50",
        };
      default:
        return {
          badge: (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          ),
          title: "Verification Pending",
          description: "Your account is under review. You'll receive access to tests once approved by admin.",
          cardClass: "border-yellow-200 bg-yellow-50",
        };
    }
  };

  const statusInfo = getStatusInfo(userProfile.verification_status);

  return (
    <Card className={statusInfo.cardClass}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Account Status</CardTitle>
          {statusInfo.badge}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-2">{statusInfo.title}</h3>
        <CardDescription className="text-sm">
          {statusInfo.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default VerificationStatus;
