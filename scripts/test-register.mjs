// Test script to verify supplier registration
const testRegister = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/supplier/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "register",
                companyName: "Test Corp API",
                email: "testcorpapi@example.com",
                phone: "9876543210",
                password: "test12345",
                productCategories: ["Textiles"],
                capacity: "small",
                moq: "100",
                serviceLocations: "Pan India"
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
};

testRegister();
