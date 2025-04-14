// src/types.ts

export interface UserProps {
    email: string;
    id: string;
    isAdmin?: boolean;
  }
  
  export interface StudentProps {
    id: string;
    email: string;
    class_id: string;
    first_name: string;
    last_name: string;
    military_name: string;
    rank: string;
  }
  