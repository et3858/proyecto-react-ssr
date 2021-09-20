import React from "react";

const Home = (props) => {
    return (
        <section className="p-2 text-center">
            <h1 className="text-6xl font-bold py-6">Error 404</h1>
            <p className="py-2">
                No se encuentró la página
            </p>
            <p>
                <button
                    type="button"
                    onClick={() => props.history.goBack()}
                >
                    Volver a la página anterior
                </button>
            </p>
        </section>
    );
};

export default Home;
