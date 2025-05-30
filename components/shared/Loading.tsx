// const Loading = () => {
//     return (
//         <div className="flex justify-center items-center h-screen">
//             <div className="flex space-x-2">
//                 <div className="w-5 h-5 bg-blue-500 rounded-full animate-bounce"></div>
//                 <div className="w-5 h-5 bg-green-500 rounded-full animate-bounce delay-[200ms]"></div>
//                 <div className="w-5 h-5 bg-red-500 rounded-full animate-bounce delay-[400ms]"></div>
//             </div>
//         </div>
//     );
// };

// export default Loading;



const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="relative">
                {/* Outer Ring */}
                <div
                    className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-green-400 border-b-purple-500 border-l-pink-400 rounded-full"
                    style={{
                        animation: "spin 3s linear infinite",
                    }}
                ></div>

                {/* Inner Ring (opposite spin direction) */}
                <div
                    className="absolute top-2 left-2 w-12 h-12 border-4 border-transparent border-t-green-400 border-r-purple-500 border-b-pink-500 border-l-blue-400 rounded-full"
                    style={{
                        animation: "reverse-spin 1.5s linear infinite",
                    }}
                ></div>
            </div>

            {/* Adding keyframes directly into the component */}
            <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes reverse-spin {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      `}</style>
        </div>
    );
};

export default Loading;


