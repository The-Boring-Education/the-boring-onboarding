import React from "react"
import { useSearchParams } from "react-router-dom"
import { OnboardingLayout, OnboardingForm, LoadingSpinner, Text } from "@tbe/ui"
import { useOnboarding } from "@tbe/hooks"

/**
 * Onboarding Page
 *
 * Now completely based on shared TBE packages
 * Zero duplication - all logic is in @tbe/* packages
 */
export default function Onboarding() {
    const [searchParams] = useSearchParams()
    const userId = searchParams.get("userId") || ""
    const productId = searchParams.get("productId") || "onboarding"
    const from = searchParams.get("from") || ""
    const redirect = searchParams.get("redirect") || "/"
    const token = searchParams.get("token") || ""

    // All logic is now in the shared useOnboarding hook
    const {
        user,
        step,
        form,
        setForm,
        loading,
        error,
        submitting,
        config,
        totalSteps,
        handleNext,
        handleBack,
        handleFinish,
        isFieldValid,
        setUsernameAvailability
    } = useOnboarding({
        userId,
        productId,
        redirect,
        token,
        from
    })

    // Show loading state while initializing
    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50'>
                <div className='text-center'>
                    <LoadingSpinner size='lg' className='mb-4' />
                    <Text variant='body1' className='text-gray-600'>
                        Preparing your onboarding experience...
                    </Text>
                </div>
            </div>
        )
    }

    // Show error if no config found
    if (!config) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50'>
                <div className='text-center max-w-md mx-auto p-8'>
                    <Text variant='h4' className='text-red-600 mb-4'>
                        Configuration Error
                    </Text>
                    <Text variant='body1' className='text-gray-600'>
                        Invalid product ID: {productId}
                    </Text>
                </div>
            </div>
        )
    }

    return (
        <OnboardingLayout
            step={step}
            totalSteps={totalSteps}
            onBack={handleBack}
            onNext={handleNext}
            onFinish={handleFinish}
            isFieldValid={isFieldValid}
            submitting={submitting}
            error={error}
            config={config}>
            <OnboardingForm
                config={config}
                form={form}
                setForm={setForm}
                step={step}
                productId={productId}
                token={token}
                user={user}
                onUsernameAvailabilityChange={setUsernameAvailability}
            />
        </OnboardingLayout>
    )
}
