import FeatureSection from "../components/FeatureSection";
import Gallery from "../components/Gallery";
import ComoComprar from "../components/Items";
import useCont from "../hooks/useCont";
import Testimonials from "./Testimonials";
const Inicio = () => {
    const { auth } = useCont();
    return (
        <>
            <div className="  ">
                <FeatureSection />
                <ComoComprar />
                <div>
                    <h2 className="text-4xl text-center">Ideas para imanes personalizados</h2>

                    <Gallery />
                </div>
                <Testimonials />
            </div>
        </>
    );
}

export default Inicio;
