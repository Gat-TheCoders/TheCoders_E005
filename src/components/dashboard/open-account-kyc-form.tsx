
'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  FileText,
  ShieldCheck,
  Wifi,
  WifiOff,
  Lock,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const kycFormSchema = z.object({
  // Step 1: Personal Details
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }).regex(/^\+?[0-9\s-]+$/, { message: "Invalid phone number format."}),

  // Step 2: Address Details
  streetAddress: z.string().min(5, { message: "Street address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  stateProvince: z.string().min(2, { message: "State/Province is required." }),
  postalCode: z.string().min(3, { message: "Postal code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  geotagLatitude: z.number().optional(),
  geotagLongitude: z.number().optional(),

  // Step 3: Identity Verification
  documentType: z.enum(['Passport', "Driver's License", 'National ID'], { required_error: "Document type is required." }),
  documentNumber: z.string().min(5, { message: "Document number is required." }),
  // Mock file uploads - in a real app, these would be file objects or upload URLs
  documentFrontPhoto: z.string().optional().describe("Data URI of document front photo (mock)"),
  documentBackPhoto: z.string().optional().describe("Data URI of document back photo (mock)"),
  selfiePhoto: z.string().optional().describe("Data URI of selfie photo (mock)"),

  // Step 4: Consent
  consent: z.boolean().refine(val => val === true, { message: "You must agree to the terms and conditions." }),
});

type KycFormValues = z.infer<typeof kycFormSchema>;

const steps = [
  { id: 1, name: 'Personal Details', fields: ['fullName', 'dateOfBirth', 'email', 'phoneNumber'] },
  { id: 2, name: 'Address Information', fields: ['streetAddress', 'city', 'stateProvince', 'postalCode', 'country', 'geotagLatitude', 'geotagLongitude'] },
  { id: 3, name: 'Identity Verification', fields: ['documentType', 'documentNumber', 'documentFrontPhoto', 'documentBackPhoto', 'selfiePhoto'] },
  { id: 4, name: 'Review & Consent', fields: ['consent'] },
];

export function OpenAccountKycForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isSecureConnection, setIsSecureConnection] = useState(false);

  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      consent: false,
    },
  });

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      if(typeof window !== 'undefined'){
        setIsSecureConnection(window.location.protocol === 'https:');
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);


  useEffect(() => {
    if (currentStep === 2) { // Identity Verification step
      const getCameraPermission = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setHasCameraPermission(false);
            toast({ variant: 'destructive', title: 'Camera API not supported', description: 'Your browser does not support camera access.'});
            return;
        }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };
      getCameraPermission();

      return () => { // Cleanup: stop video stream when component unmounts or step changes
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [currentStep, toast]);

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast({ variant: 'destructive', title: 'Geolocation not supported', description: 'Your browser does not support geolocation.' });
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue('geotagLatitude', position.coords.latitude);
        form.setValue('geotagLongitude', position.coords.longitude);
        toast({ title: 'Location Acquired', description: `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}` });
        setIsLoading(false);
      },
      (error) => {
        toast({ variant: 'destructive', title: 'Geolocation Error', description: error.message });
        setIsLoading(false);
      }
    );
  };
  
  const handleCaptureSelfie = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/png');
        setCapturedSelfie(dataUri);
        form.setValue('selfiePhoto', dataUri); // Save to form (mock)
        toast({ title: 'Selfie Captured', description: 'Simulating face verification process.' });
      }
    }
  };

  // Mock file input handler
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, fieldName: keyof KycFormValues) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this file and store a URL or ID.
      // For this mock, we'll just store the file name.
      // Or convert to Data URI if small and for demo (not recommended for large files)
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue(fieldName as any, reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({ title: `${fieldName.replace('Photo', '')} Uploaded`, description: file.name });
    }
  };


  const nextStep = async () => {
    const fieldsToValidate = steps[currentStep].fields as (keyof KycFormValues)[];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
       toast({variant: "destructive", title: "Validation Error", description: "Please correct the errors before proceeding."})
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit: SubmitHandler<KycFormValues> = async (data) => {
    setIsLoading(true);
    // console.log('KYC Data Submitted:', data); // Removed console.log
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    toast({
      title: 'Application Submitted!',
      description: 'Your bank account application has been successfully submitted for review.',
      variant: 'default',
      className: 'bg-green-100 border-green-300 text-green-700'
    });
    form.reset();
    setCapturedSelfie(null);
    setCurrentStep(0);
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle>KYC Application Form</CardTitle>
        <CardDescription>Please fill out all sections carefully. Progress: Step {currentStep + 1} of {steps.length}</CardDescription>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="mt-2" />
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            {isOnline ? <Wifi className="h-4 w-4 mr-1 text-green-500" /> : <WifiOff className="h-4 w-4 mr-1 text-red-500" />}
            Status: {isOnline ? 'Online' : 'Offline'}
          </div>
          <div className="flex items-center">
            {isSecureConnection ? <Lock className="h-4 w-4 mr-1 text-green-500" /> : <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />}
            Connection: {isSecureConnection ? 'Secure (HTTPS)' : 'Insecure (HTTP)'}
          </div>
        </div>
         {!isSecureConnection && (
            <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Insecure Connection</AlertTitle>
                <AlertDescription>
                You are not on a secure HTTPS connection. For your security, sensitive information should only be submitted over HTTPS.
                </AlertDescription>
            </Alert>
        )}
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {currentStep === 0 && ( // Personal Details
              <section className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                     <FormItem className="flex flex-col">
                        <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email Address</FormLabel>
                    <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Phone Number</FormLabel>
                    <FormControl><Input type="tel" placeholder="+1 123 456 7890" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </section>
            )}

            {currentStep === 1 && ( // Address Information
              <section className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-semibold text-primary">Address Information</h3>
                 <FormField control={form.control} name="streetAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Street Address</FormLabel>
                    <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl><Input placeholder="Anytown" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="stateProvince" render={({ field }) => (
                        <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl><Input placeholder="CA" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="postalCode" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl><Input placeholder="90210" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center"><Globe className="mr-2 h-4 w-4 text-muted-foreground" />Country</FormLabel>
                        <FormControl><Input placeholder="USA" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLoading} className="w-full md:w-auto">
                  <MapPin className="mr-2 h-4 w-4" /> Get Current Location (Geo-tag)
                </Button>
                {form.watch('geotagLatitude') && form.watch('geotagLongitude') && (
                  <p className="text-sm text-muted-foreground">
                    Geo-tagged Location: Lat: {form.watch('geotagLatitude')?.toFixed(4)}, Lon: {form.watch('geotagLongitude')?.toFixed(4)}
                  </p>
                )}
              </section>
            )}

            {currentStep === 2 && ( // Identity Verification
              <section className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-semibold text-primary">Identity Verification</h3>
                <FormField control={form.control} name="documentType" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><FileText className="mr-2 h-4 w-4 text-muted-foreground" />Document Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Passport">Passport</SelectItem>
                        <SelectItem value="Driver's License">Driver's License</SelectItem>
                        <SelectItem value="National ID">National ID</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="documentNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Number</FormLabel>
                    <FormControl><Input placeholder="ABC123XYZ" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormItem>
                  <FormLabel>Upload Document Front (Mock)</FormLabel>
                  <FormControl><Input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'documentFrontPhoto')} /></FormControl>
                  {form.watch('documentFrontPhoto') && <p className="text-xs text-muted-foreground">File ready: { (form.watch('documentFrontPhoto') as string).substring(0,30) }...</p>}
                </FormItem>
                <FormItem>
                  <FormLabel>Upload Document Back (Mock - Optional)</FormLabel>
                  <FormControl><Input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'documentBackPhoto')} /></FormControl>
                   {form.watch('documentBackPhoto') && <p className="text-xs text-muted-foreground">File ready: { (form.watch('documentBackPhoto') as string).substring(0,30) }...</p>}
                </FormItem>

                <FormLabel className="flex items-center"><Camera className="mr-2 h-4 w-4 text-muted-foreground" />Live Selfie Capture</FormLabel>
                {hasCameraPermission === null && <p className="text-sm text-muted-foreground">Requesting camera permission...</p>}
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                        Please allow camera access in your browser settings to capture a selfie. You may need to refresh the page after granting permission.
                        </AlertDescription>
                    </Alert>
                )}
                {hasCameraPermission && (
                    <div className="space-y-2">
                        <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                        <Button type="button" onClick={handleCaptureSelfie} className="w-full md:w-auto">
                            <Camera className="mr-2 h-4 w-4" /> Capture Selfie
                        </Button>
                        {capturedSelfie && (
                            <div>
                                <p className="text-sm font-medium">Captured Selfie Preview:</p>
                                <img src={capturedSelfie} alt="Captured selfie" className="mt-2 rounded-md border max-w-xs" />
                            </div>
                        )}
                    </div>
                )}
              </section>
            )}

            {currentStep === 3 && ( // Review & Consent
              <section className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-semibold text-primary">Review & Consent</h3>
                <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>Final Step!</AlertTitle>
                    <AlertDescription>
                    Please review our terms and conditions. By submitting this application, you confirm that all information provided is accurate and complete to the best of your knowledge.
                    </AlertDescription>
                </Alert>
                <FormField control={form.control} name="consent" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <input type="checkbox" checked={field.value} onChange={field.onChange} className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary border-gray-300" />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the <Link href="/terms-of-service" target="_blank" className="underline text-primary hover:text-accent">Terms and Conditions</Link> and <Link href="/privacy-policy" target="_blank" className="underline text-primary hover:text-accent">Privacy Policy</Link>.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )} />
              </section>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6 mt-6">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="button" onClick={nextStep} disabled={isLoading} className="ml-auto">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="submit" disabled={isLoading || !form.watch('consent')} className="ml-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Submit Application
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

