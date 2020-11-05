package supernova;

import arc.*;
import arc.util.*;
import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.events.ReadyEvent;
import net.dv8tion.jda.api.events.guild.member.*;
import net.dv8tion.jda.api.events.message.*;
import net.dv8tion.jda.api.hooks.*;

import static supernova.Supernova.*;

public class Messages extends ListenerAdapter{
    public static final String prefix = "sn!";

    @Override
    public void onReady(ReadyEvent event){
        Log.info("@ is ready!", Core.settings.getAppName());
    }

    @Override
    public void onMessageReceived(MessageReceivedEvent event){
        try{
            Message message = event.getMessage();
            String content = message.getContentRaw();

            if(content.startsWith(prefix)){
                commands.handle(message);
            }

            if(content.equals("shutdown for now")){
                message.delete().complete();

                Supernova.jda.shutdown();
                Core.app.exit();
            }
        }catch(Exception e){
            e.printStackTrace();
        }
    }

    @Override
    public void onMessageUpdate(MessageUpdateEvent event){

    }

    @Override
    public void onMessageDelete(MessageDeleteEvent event){
        
    }

    @Override
    public void onGuildMemberJoin(GuildMemberJoinEvent event){
        StringBuilder builder = new StringBuilder()
            .append("Welcome to the **Mechanical Warfare** server, the official chatroom of Mechanical Warfare mod!\n")
            .append('\n')
            .append("Make sure to read the rules in #the-council.\n")
            .append("Have a great time!");

        event.getUser().openPrivateChannel().complete().sendMessage(builder.toString());
    }
}
