import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { Request, Response } from 'express';
import generateTokenAndSetCookie from "../utils/generateToken";


export const signUp = async (req: Request,res: Response) =>{
    try {
    
		const { firstName, lastName, username, password, confirmPassword } = req.body;

        if (firstName == undefined || firstName == "" || lastName == '' || lastName == undefined || username == '' || username == undefined || password == '' || password == undefined || confirmPassword == ''|| confirmPassword == undefined ) {
            return res.status(400).json({status: "failed", error: "Missing required field(s)" });
        }

		if (password !== confirmPassword) {
			return res.status(400).json({status: "failed", error: "Passwords don't match" });
		}

		const user = await User.findOne({ username });

		if (user) {
			return res.status(400).json({status: "failed", error: "Username already exists" });
		}

		// HASH PASSWORD HERE
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);


		const newUser = new User({
			firstName,
            lastName,
			username,
			password: hashedPassword,
		});

		if (newUser) {
			// Generate JWT token here
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({status: "success", data: {
				_id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
				username: newUser.username,
			}});
		} else {
			res.status(400).json({status: "failed", error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error instanceof Error ? error.message : error);
		res.status(500).json({status: "failed", error: "Internal Server Error" });
	}
}

export const signIn = async (req: Request,res: Response) =>{
    try {
		const { username, password } = req.body;
        if (username == '' || username == undefined || password == '' || password == undefined ) {
            return res.status(400).json({status: "failed", error: "Missing required field(s)" });
        }

		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({status: "failed", error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({status: "success", data: {
			_id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
			username: user.username,
		}});
	} catch (error) {
		console.log("Error in login controller", error instanceof Error ? error.message : error);
		res.status(500).json({status: "failed", error: "Internal Server Error" });
	}
}

export const signOut = (req: Request,res: Response) =>{
    try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({status: "success", message: "Logged out successfully" });
	} catch (error) {
       
		console.log("Error in logout controller", error instanceof Error ? error.message : error);
		res.status(500).json({status: "failed", error: "Internal Server Error" });
	}
}




