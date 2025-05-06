import {Link} from "react-router-dom";

function ComingSoon(){

    return (
        <div className="bg-gray-100 dark:bg-gray-800">
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="max-w-2xl w-full px-4">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Coming Soon!</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">Web page is under
                        construction. We'll be back soon!
                    </p>
                </div>
                <div className="flex justify-center">
                    <Link to={"/"}
                          className="px-8 py-4 text-xl font-semibold rounded-sm bg-gray-500 text-gray-50 hover:text-gray-2">
                        Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon;
