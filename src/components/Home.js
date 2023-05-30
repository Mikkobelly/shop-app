import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home">
            <div>
                <q>Style, Comfort, and Confidence</q>
                <Link to="/products" className='home__btn'>
                    Shop Now
                </Link>
            </div>
        </div>
    )
}

export default Home