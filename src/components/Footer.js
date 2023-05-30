import { BsInstagram, BsFacebook, BsTwitter } from "react-icons/bs";

function Footer() {
    return (
        <footer>
            <div className="icon-box">
                <a href="">
                    <BsInstagram />
                </a>
                <a href="">
                    <BsFacebook />
                </a>
                <a href="">
                    <BsTwitter />
                </a>
            </div>
            <p>United Kingdom | Designed by Miki Akuta</p>
        </footer>
    )
}

export default Footer
