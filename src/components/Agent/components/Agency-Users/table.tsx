import { FC } from "react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, Home, Mail, Phone, Star } from "lucide-react";

type tableProps = {
    data: any[]
}
export const TableColumn : FC<tableProps> = ({data}) =>  {
    return(
        <></>
    //     <Card>
    //     <CardHeader>
    //       <CardTitle>Sub-Agents ({data.length})</CardTitle>
    //       <CardDescription>
    //         Manage and view performance of all sub-agents in your agency. Click on any row to view detailed information.
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <Table>
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead>Agent</TableHead>
    //             <TableHead>Contact</TableHead>
    //             <TableHead>Specialization</TableHead>
    //             <TableHead>Sales</TableHead>
    //             <TableHead>Listings</TableHead>
    //             <TableHead>Rating</TableHead>
    //             <TableHead>Commission</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {paginatedAgents.map((agent) => (
    //             <TableRow 
    //               key={agent.id}
    //               className="cursor-pointer hover:bg-muted/50 transition-colors"
    //               onClick={() => handleUserClick(agent)}
    //             >
    //               <TableCell>
    //                 <div className="flex items-center gap-3">
    //                   <Avatar className="h-8 w-8">
    //                     <AvatarImage src={agent.avatar} alt={`${agent.firstName} ${agent.lastName}`} />
    //                     <AvatarFallback>{agent.firstName[0]}{agent.lastName[0]}</AvatarFallback>
    //                   </Avatar>
    //                   <div>
    //                     <div className="font-medium">{agent.firstName} {agent.lastName}</div>
    //                     <div className="text-sm text-muted-foreground">
    //                       Joined {new Date(agent.joined).toLocaleDateString()}
    //                     </div>
    //                   </div>
    //                 </div>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="space-y-1">
    //                   <div className="flex items-center gap-1 text-sm">
    //                     <Mail className="h-3 w-3" />
    //                     {agent.email}
    //                   </div>
    //                   <div className="flex items-center gap-1 text-sm text-muted-foreground">
    //                     <Phone className="h-3 w-3" />
    //                     {agent.phone}
    //                   </div>
    //                 </div>
    //               </TableCell>
    //               <TableCell>
    //                 <Badge variant="secondary">{agent.specialization}</Badge>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="font-medium">${(agent.totalSales / 1000000).toFixed(1)}M</div>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="flex items-center gap-1">
    //                   <Home className="h-3 w-3" />
    //                   {agent.activeListings}
    //                 </div>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="flex items-center gap-1">
    //                   <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
    //                   <span className="font-medium">{agent.rating}</span>
    //                   <span className="text-muted-foreground text-sm">({agent.reviews})</span>
    //                 </div>
    //               </TableCell>
    //               <TableCell>
    //                 <div className="font-medium">{agent.commissionRate}%</div>
    //               </TableCell>
    //             </TableRow>
    //           ))}
    //         </TableBody>
    //       </Table>

    //       {/* Pagination */}
    //       {totalPages > 1 && (
    //         <div className="flex justify-center pt-4">
    //           <Pagination>
    //             <PaginationContent>
    //               <PaginationItem>
    //                 <PaginationPrevious 
    //                   href="#"
    //                   onClick={(e) => {
    //                     e.preventDefault();
    //                     // if (currentPage > 1) setCurrentPage(currentPage - 1);
    //                   }}
    //                   className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
    //                 />
    //               </PaginationItem>
                  
    //               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
    //                 <PaginationItem key={page}>
    //                   <PaginationLink
    //                     href="#"
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       //setCurrentPage(page);
    //                     }}
    //                     isActive={currentPage === page}
    //                   >
    //                     {page}
    //                   </PaginationLink>
    //                 </PaginationItem>
    //               ))}
                  
    //               <PaginationItem>
    //                 <PaginationNext 
    //                   href="#"
    //                   onClick={(e) => {
    //                     e.preventDefault();
    //                     // if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    //                   }}
    //                   className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
    //                 />
    //               </PaginationItem>
    //             </PaginationContent>
    //           </Pagination>
    //         </div>
    //       )}
    //     </CardContent>
    //   </Card>
    );
}