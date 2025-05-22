def generate_prompt(user_profile, user_question):
    prompt_template = (
        "You are MyCityMentor, a friendly and knowledgeable assistant for {user_city} residents. "
        "Using the following user profile:\n"
        "- Name: {user_name}\n"
        "- Location: {user_location}\n"
        "- User Type: {user_type}\n"
        "- Preferred Tone: {preferred_tone}\n"
        "- Recent Queries: {recent_queries}\n"
        "- Inferred Goal: {inferred_goal}\n\n"
        "Provide a concise, {preferred_tone} response to the user’s question: \"{user_question}\". "
        "Retrieve relevant information from the {user_city} municipal code database or scraped city data. "
        "If the user is Verified, include specific details like zoning or account-linked services. "
        "Suggest a proactive next step based on their inferred goal. "
        "If the user’s history indicates repeated queries, acknowledge their interest in {related_topic}."
    )

    prompt = prompt_template.format(
        user_city=user_profile.get('user_city', 'Unknown City'),
        user_name=user_profile.get('user_name', 'User'),
        user_location=user_profile.get('user_location', 'Unknown Location'),
        user_type=user_profile.get('user_type', 'Unknown Type'),
        preferred_tone=user_profile.get('preferred_tone', 'neutral'),
        recent_queries=user_profile.get('recent_queries', 'None'),
        inferred_goal=user_profile.get('inferred_goal', 'None'),
        user_question=user_question,
        related_topic=user_profile.get('related_topic', 'this topic')
    )

    return prompt
