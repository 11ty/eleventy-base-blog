document.addEventListener('DOMContentLoaded', function () {
    const letters = document.querySelectorAll('.letter-container');
    const decayFactor = 0.95; // Adjust this value to control the decay rate
    const rotationSpeed = 2; // Adjust this value to change rotation speed
    const circumference = 30; // Approximate "circumference" of the letter for rolling calculations

    letters.forEach(letter => {
        let lastX;
        let accumulatedX = 0; // Keep track of accumulated horizontal displacement
        let accumulatedRotation = 0; // Keep track of accumulated rotation
        let momentumX = 0;
        let momentumRotation = 0;
        let animationFrameId;

        letter.style.transformOrigin = 'center 60%';

        const applyMomentum = () => {
            if (Math.abs(momentumX) < 0.1 && Math.abs(momentumRotation) < 0.1) {
                cancelAnimationFrame(animationFrameId); // Stop the animation when momentum is negligible
                return;
            }

            // Apply decay to the momentum
            momentumX *= decayFactor;
            momentumRotation *= decayFactor;

            // Update the accumulated values
            accumulatedX += momentumX;
            accumulatedRotation += momentumRotation;

            // Apply the accumulated transformations to the letter
            letter.style.transform = `translateX(${accumulatedX}px) rotate(${accumulatedRotation}deg)`;

            animationFrameId = requestAnimationFrame(applyMomentum);
        };

        const handleMove = (e) => {
            if (!lastX) {
                lastX = e.clientX;
                return;
            }

            const deltaX = e.clientX - lastX;
            const direction = deltaX > 0 ? 1 : -1;

            // Update the momentum based on cursor movement
            momentumRotation = direction * Math.abs(deltaX) * rotationSpeed;
            // Convert the degrees of rotation to a distance based on the assumed circumference
            momentumX = (momentumRotation / 360) * circumference;

            // Update the accumulated values with the initial momentum
            accumulatedX += momentumX;
            accumulatedRotation += momentumRotation;

            // Apply the accumulated transformations to the letter
            letter.style.transform = `translateX(${accumulatedX}px) rotate(${accumulatedRotation}deg)`;

            lastX = e.clientX;

            // Start the momentum decay animation
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(applyMomentum);
        };

        letter.addEventListener('mouseenter', (e) => {
            lastX = null; // Reset lastX on entering a new letter
        });

        letter.addEventListener('mousemove', handleMove);
    });
});
