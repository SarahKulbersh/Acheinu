import React from 'react'
import { SignIn } from '../signIn';

export default function PrivateRoute({ children }) {
    const userId = sessionStorage.getItem("userId")
    if (!userId) return <SignIn />
    return children;
}
