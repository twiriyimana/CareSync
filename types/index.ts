export type Role="patient"|"doctor"|"admin";
export type AppointmentStatus="pending"|"confirmed"|"completed"|"cancelled"|"rejected";
export interface Appointment{id?:string;patientId:string;doctorId:string;patientName?:string;doctorName?:string;date:string;time:string;reason?:string;status:AppointmentStatus;paymentStatus?: "unpaid"|"paid"|"failed";}