import React from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button, Container, Nav, Navbar } from "react-bootstrap"

const NavBar: React.FC = () => {
  const { accessToken, logout } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar className="navbar navbar-expand navbar-custom">
      <Container className="container">
        <Navbar.Brand className="navbar-custom navbar-brand">DJ-GPT</Navbar.Brand>
		<Navbar.Collapse>
			<Nav className="me-auto" style={{ paddingTop: '3px' }}>
				<Link to="/" className="nav-link">
					{accessToken ? 'Home' : 'Login'}
				</Link>	
				
				<Link to="/about" className="nav-link">
					About
				</Link>
			</Nav>
			<Nav>
				{accessToken && (
					<Nav.Link>
						<Button
						variant="outline-danger"
						onClick={handleLogout}
						>
						Logout
						</Button>
					</Nav.Link>
				)}
			</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
