import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, Phone, UserPlus } from "lucide-react";
import { axiosInstance } from "@/lib/axios-interceptor";
import { decryptData, validatePhoneNumber } from "../../../../../../utils/helpers";

const userFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^(?:\+234|234|0)(70|80|81|90|91)\d{8}$/,
      "Please enter a valid phone number"
    )
    .max(13, "Phone number can be 11 or 13 digits long"),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormDialogProps {
  trigger?: React.ReactNode;
  setRefresh : (flag : boolean) => void; 
}

export function AddAgent({ trigger, setRefresh }: UserFormDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    //const descrypted = decryptData("", process.env.NEXT_PUBLIC_PASSWORD_ENCRYPTION_KEY as string);
    //console.log({descrypted : JSON.parse(descrypted)});
    //get agencyId from data

    if(!validatePhoneNumber(data.phoneNumber)){
        toast.error("Invalid Phone Number format", {
        description: `Valid Format e.g(09087039240)`,
        });
        return;
    }
    const response = await axiosInstance.post(`agency/sub-agents/create`, {
        firstName :  data.firstName ,
        lastName :  data.lastName ,
        email :  data.email ,
        agencyId :  "8b6c7c37-72b5-4db8-9184-214f32b8b68d",//data.firstName,
        phoneNumber :  data.phoneNumber 
    });

    console.log({response});
    if(response?.data?.code === 201){
        setRefresh(true);
        setTimeout(() => {
            toast.success(response?.data?.message, {description : "New Agent added to Agency!"});
        }, 3000);
        reset();
        setOpen(false);
    }else{
        toast.error("Error",{description : response?.data?.message});
    }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md shadow-dialog border-border/50 animate-scale-in bg-white">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Create New User
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details below to add a new user to your system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  placeholder="John"
                  className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  {...register("firstName")}
                />
              </div>
              {errors.firstName && (
                <p className="text-sm text-destructive animate-fade-in">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  {...register("lastName")}
                />
              </div>
              {errors.lastName && (
                <p className="text-sm text-destructive animate-fade-in">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive animate-fade-in">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+234-(90555)-(123-4567)"
                className="pl-10 h-11 transition-all focus:ring-2 focus:ring-primary/20"
                {...register("phoneNumber")}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-destructive animate-fade-in">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
