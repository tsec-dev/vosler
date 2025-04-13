"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

// Type definition for military ranks
type BranchType = "Army" | "AirForce" | "Navy" | "Marines" | "CoastGuard" | "SpaceForce";

const MILITARY_RANKS: Record<BranchType, string[]> = {
  Army: [
    "PVT", "PV2", "PFC", "SPC", "CPL", "SGT", "SSG", "SFC", "MSG", "1SG", "SGM", "CSM",
    "2LT", "1LT", "CPT", "MAJ", "LTC", "COL", "BG", "MG", "LTG", "GEN"
  ],
  AirForce: [
    "AB", "Amn", "A1C", "SrA", "SSgt", "TSgt", "MSgt", "SMSgt", "CMSgt", "CCM",
    "2d Lt", "1st Lt", "Capt", "Maj", "Lt Col", "Col", "Brig Gen", "Maj Gen", "Lt Gen", "Gen"
  ],
  Navy: [
    "SR", "SA", "SN", "PO3", "PO2", "PO1", "CPO", "SCPO", "MCPO", "MCPOC",
    "ENS", "LTJG", "LT", "LCDR", "CDR", "CAPT", "RDML", "RADM", "VADM", "ADM"
  ],
  Marines: [
    "Pvt", "PFC", "LCpl", "Cpl", "Sgt", "SSgt", "GySgt", "MSgt", "1stSgt", "MGySgt", "SgtMaj",
    "2ndLt", "1stLt", "Capt", "Maj", "LtCol", "Col", "BGen", "MajGen", "LtGen", "Gen"
  ],
  CoastGuard: [
    "SR", "SA", "SN", "PO3", "PO2", "PO1", "CPO", "SCPO", "MCPO", "MCPOCG",
    "ENS", "LTJG", "LT", "LCDR", "CDR", "CAPT", "RDML", "RADM", "VADM", "ADM"
  ],
  SpaceForce: [
    "Spc1", "Spc2", "Spc3", "Spc4", "Sgt", "TSgt", "MSgt", "SMSgt", "CMSgt", "CMSSF",
    "2d Lt", "1st Lt", "Capt", "Maj", "Lt Col", "Col", "Brig Gen", "Maj Gen", "Lt Gen", "Gen"
  ]
};

export default function ProfileSetupPage() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  
  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [branch, setBranch] = useState<BranchType>("Army");
  const [rank, setRank] = useState("");
  const [yearsOfService, setYearsOfService] = useState("");
  const [currentDuty, setCurrentDuty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileExists, setProfileExists] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    // Pre-fill name fields from Clerk user object if available
    if (user.firstName) setFirstName(user.firstName);
    if (user.lastName) setLastName(user.lastName);
    
    // Check if profile already exists
    const checkProfile = async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
        
      if (data) {
        setProfileExists(true);
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setBranch((data.branch as BranchType) || "Army");
        setRank(data.rank || "");
        setYearsOfService(data.years_of_service?.toString() || "");
        setCurrentDuty(data.current_duty || "");
        setIsExistingUser(true);
        
        // Set a cookie to mark as existing user for middleware
        document.cookie = "existing_user=true; path=/; max-age=86400";
      }
      
      // Also check for existing user by email
      if (!data) {
        const { data: emailData } = await supabase
          .from("students")
          .select("id")
          .eq("email", user.emailAddresses[0]?.emailAddress)
          .maybeSingle();
          
        if (emailData) {
          setIsExistingUser(true);
          document.cookie = "existing_user=true; path=/; max-age=86400";
        }
      }
    };
    
    checkProfile();
  }, [user]);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!firstName || !lastName || !branch || !rank) {
      setError("Please fill out all required fields.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Update or create student profile
      const studentData = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        first_name: firstName,
        last_name: lastName, 
        branch: branch,
        rank: rank,
        years_of_service: yearsOfService ? parseFloat(yearsOfService) : null,
        current_duty: currentDuty,
        updated_at: new Date()
      };
      
      const { error: supabaseError } = await supabase
        .from("students")
        .upsert(studentData);
        
      if (supabaseError) throw supabaseError;
      
      // Update Clerk user metadata
      try {
        await user.update({
          firstName,
          lastName,
          // Using unsafeMetadata since we can't directly access publicMetadata in client components
          unsafeMetadata: {
            profile_completed: true,
            rank,
            branch
          }
        });
      } catch (userUpdateError) {
        console.error("Error updating user metadata:", userUpdateError);
        // Continue anyway as the database was updated
      }
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Error saving profile:", err);
      setError(err instanceof Error ? err.message : "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkip = async () => {
    if (!user) return;
    
    try {
      // Mark profile as completed in metadata
      await user.update({
        unsafeMetadata: {
          profile_completed: true
        }
      });
      
      // Set cookie for middleware
      document.cookie = "existing_user=true; path=/; max-age=2592000"; // 30 days
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Error updating metadata:", err);
      // Force redirect anyway
      router.push("/dashboard");
    }
  };
  
  if (!user) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            {profileExists ? "Update Your Profile" : "Welcome! Complete Your Profile"}
          </h1>
          <p className="mt-2 text-gray-400">
            {profileExists 
              ? "Review and update your information below."
              : "Please provide some information to get started with your PME experience."
            }
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Military Branch *</label>
              <select
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value as BranchType);
                  setRank(""); // Reset rank when branch changes
                }}
                className="w-full p-2 border rounded bg-gray-700 text-white"
                required
              >
                {Object.keys(MILITARY_RANKS).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Rank *</label>
              <select
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white"
                required
              >
                <option value="">Select Rank</option>
                {MILITARY_RANKS[branch].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Years of Service</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={yearsOfService}
                onChange={(e) => setYearsOfService(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Current Duty Station/Assignment</label>
              <input
                type="text"
                value={currentDuty}
                onChange={(e) => setCurrentDuty(e.target.value)}
                className="w-full p-2 border rounded bg-gray-700 text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            {isExistingUser && (
              <button
                type="button"
                onClick={handleSkip}
                className="px-5 py-2 bg-gray-600 hover:bg-gray-500 rounded"
              >
                Skip for Existing Users
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                profileExists ? "Update Profile" : "Complete Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}