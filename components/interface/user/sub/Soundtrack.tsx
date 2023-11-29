// import React, { Fragment, useRef } from "react";
// import { useUserSoundtrackQuery } from "@/lib/api/userAPI";
//
// import User from "../../../artifacts/User";
// import format from "date-fns/format";
// import { Record } from "@/types/dbTypes";
// import { JellyComponent } from "@/components/global/Loading";
//
// const Soundtrack = ({ userId }: { userId: string }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//
//   const {
//     data: mergedData,
//     isLoading,
//     isError,
//   } = useUserSoundtrackQuery(userId);
//
//   let lastMonth = "";
//   return (
//     <div
//       ref={containerRef}
//       className="flex flex-col w-1/2 overflow-scroll h-full pt-8 gap-4"
//     >
//       {isLoading ? (
//         <JellyComponent
//           className={
//             "absolute left-1/2 top-1/2 translate-x-1/2 translate-y-1/2"
//           }
//           key="jelly"
//           isVisible={true}
//         />
//       ) : isError ? (
//         <p>An error occurred</p>
//       ) : (
//         mergedData.map((record: Record, index: number) => {
//           const createdAt = new Date(record.createdAt);
//           const currentMonth = format(createdAt, "MMMM");
//
//           const isNewMonth = lastMonth !== currentMonth;
//
//           if (isNewMonth) {
//             lastMonth = currentMonth;
//           }
//
//           return (
//             <Fragment key={record.albumId}>
//               {isNewMonth && (
//                 <h2 className="px-8 text-xs uppercase font-medium text-gray3 -mb-4 tracking-widest">
//                   {currentMonth}
//                 </h2>
//               )}
//               <User
//                 record={record}
//                 associatedType={record.album ? "album" : "song"}
//               />
//             </Fragment>
//           );
//         })
//       )}
//     </div>
//   );
// };
//
// export default Soundtrack;
