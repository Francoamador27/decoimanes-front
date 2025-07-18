
const Alerta = ({ children }) => {
    return (
        <div className="text-center my-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {children}
        </div>
    );
}

export default Alerta;
