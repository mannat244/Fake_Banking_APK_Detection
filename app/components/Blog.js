import React from 'react'

const Blog = ({ name, details }) => {
    return (
        <div
            className="flex flex-row flex-wrap justify-center gap-5 from-blue-50 to-blue-300 p-8"
            style={{ background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)" }}
        >
            {[1, 2, 3].map((id) => (
                <div
                    key={id}
                    className="bg-[#101624] border border-blue-500 rounded-xl shadow-md min-w-[280px] max-w-xs flex-1 flex flex-col items-center p-4 m-2"
                >
                    <img
                        src={`https://picsum.photos/seed/${id}/400/200`}
                        alt={`Blog post ${id}`}
                        className="w-full rounded-lg mb-3"
                    />
                    <h2 className="text-blue-700 mb-2 text-lg font-semibold">{name} {id}</h2>
                    <p className="text-white-800 text-center">
                        This is a dummy description for blog post {id}. Details {details}.
                    </p>
                </div>
            ))}
        </div>
    )
}

export default Blog
