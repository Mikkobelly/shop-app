import { BsInstagram, BsFacebook, BsTwitter } from "react-icons/bs";

function Footer() {
    return (
        <footer>
            <div className="icon-box">
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                    <BsInstagram />
                </a>
                <a href="https://en-gb.facebook.com/" target="_blank" rel="noopener noreferrer">
                    <BsFacebook />
                </a>
                <a href="https://twitter.com/Twitter" target="_blank" rel="noopener noreferrer">
                    <BsTwitter />
                </a>
            </div>
            <p>United Kingdom | Designed by Miki Akuta</p>
        </footer>
    )
}

export default Footer
